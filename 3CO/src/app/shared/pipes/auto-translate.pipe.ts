import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AnylangService } from '../services/anylang.service';
import { I18nHandlerService } from '../services/i18n-handler.service';
import { Subscription } from 'rxjs';

@Pipe({
    name: 'autoTranslate',
    pure: false // Important: allows the pipe to update when shouldTranslate changes
})
export class AutoTranslatePipe implements PipeTransform, OnDestroy {
    private translatedCache = new Map<string, string>();
    private pendingTranslations = new Set<string>();
    private targetLang: string = '';
    private langSubscription?: Subscription;

    constructor(
        private anylangService: AnylangService,
        private i18nService: I18nHandlerService,
        private cdr: ChangeDetectorRef
    ) {
        // Get initial target language
        this.i18nService.getPreferredLanguage().then(lang => {
            this.targetLang = lang;
        });

        // Subscribe to language changes
        this.langSubscription = this.anylangService.currentLanguage$.subscribe(lang => {
            if (lang && lang !== this.targetLang) {
                console.log(`Language changed from ${this.targetLang} to ${lang}, clearing translation cache`);
                this.targetLang = lang;
                // Clear cache when language changes so translations re-run
                this.translatedCache.clear();
                this.cdr.markForCheck();
            }
        });
    }

    ngOnDestroy() {
        this.langSubscription?.unsubscribe();
    }

    transform(text: string, shouldTranslate: boolean = false): string {
        // If translation is not requested, return original text
        if (!shouldTranslate || !text) {
            return text;
        }

        // Wait for target language to be loaded
        if (!this.targetLang) {
            return text;
        }

        // Create cache key
        const cacheKey = `${text}::${this.targetLang}`;

        // Return cached translation if available
        if (this.translatedCache.has(cacheKey)) {
            return this.translatedCache.get(cacheKey)!;
        }

        // If translation is already in progress, return original text temporarily
        if (this.pendingTranslations.has(cacheKey)) {
            return text;
        }

        // Start new translation
        this.pendingTranslations.add(cacheKey);
        this.anylangService
            .translate(text, this.targetLang)
            .then(translated => {
                this.translatedCache.set(cacheKey, translated);
                this.pendingTranslations.delete(cacheKey);
                this.cdr.markForCheck(); // Trigger change detection
            })
            .catch(err => {
                console.error('Translation error in pipe:', err);
                this.pendingTranslations.delete(cacheKey);
            });

        // Return original text while translation is in progress
        return text;
    }
}
