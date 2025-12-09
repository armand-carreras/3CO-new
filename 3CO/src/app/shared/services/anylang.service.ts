import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { pipeline, Pipeline } from '@xenova/transformers';
import { franc } from 'franc-min';

@Injectable({
  providedIn: 'root'
})
export class AnylangService {

  private cache = new Map<string, string>();
  private translator: Pipeline | null = null;
  private modelName = 'Xenova/nllb-200-distilled-600M';
  private isLoading = false;

  // Map common language codes to NLLB codes
  private langMap: { [key: string]: string } = {
    'en': 'eng_Latn',
    'en-GB': 'eng_Latn',
    'en-US': 'eng_Latn',
    'es': 'spa_Latn',
    'es-ES': 'spa_Latn',
    'ca': 'cat_Latn',
    'ca-ES': 'cat_Latn',
    'fr': 'fra_Latn',
    'fr-FR': 'fra_Latn',
    'de': 'deu_Latn',
    'de-DE': 'deu_Latn',
    'it': 'ita_Latn',
    'it-IT': 'ita_Latn',
  };

  // Map franc language codes to NLLB codes
  private francToNllb: { [key: string]: string } = {
    'spa': 'spa_Latn', // Spanish
    'eng': 'eng_Latn', // English
    'cat': 'cat_Latn', // Catalan
    'fra': 'fra_Latn', // French
    'deu': 'deu_Latn', // German
    'ita': 'ita_Latn', // Italian
    'por': 'por_Latn', // Portuguese
  };

  currentLanguage$ = new BehaviorSubject<string>('en-GB');
  modelDownloadProgress$ = new BehaviorSubject<number>(0);

  constructor(private storage: StorageService) {
    this.storage.getPreferredLanguage().then(lang => this.currentLanguage$.next(lang));
  }

  // Method to update current language (called when user changes language in settings)
  public updateCurrentLanguage(lang: string) {
    this.currentLanguage$.next(lang);
  }

  public async init() {
    if (this.translator) {
      this.modelDownloadProgress$.next(100);
      return;
    }
    if (this.isLoading) {
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.isLoading = true;
    try {
      await this.storage.ensureReady();
      const alreadyLoaded = await this.storage.get('model_loaded');

      // @ts-ignore
      this.translator = await pipeline('translation', this.modelName, {
        progress_callback: (data: any) => {
          if (alreadyLoaded) return; // Suppress progress if already loaded

          if (data.status === 'progress' && data.file) {
            const fileProgress = (data.loaded / data.total) * 100;
            const sizeMB = (data.total / 1024 / 1024).toFixed(1);
            console.log(`Downloading ${data.file} (${sizeMB}MB): ${fileProgress.toFixed(1)}%`);

            // Cap progress at 95% so we don't trigger navigation until all files are done
            this.modelDownloadProgress$.next(Math.min(Math.round(fileProgress), 95));
          } else if (data.status === 'ready') {
            console.log('Model ready!');
            // Do not emit 100 here, wait for the promise to resolve
          }
        }
      });
      console.log('Translation model loaded successfully!');

      // Mark model as loaded in storage
      if (!alreadyLoaded) {
        await this.storage.set('model_loaded', true);
      }

      this.modelDownloadProgress$.next(100);
    } catch (error) {
      console.error('Failed to load translation model:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async translate(text: string, targetLang: string): Promise<string> {
    if (!text) return '';

    const cacheKey = `${text}::${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    await this.init();

    if (!this.translator) {
      throw new Error('Translator not initialized');
    }

    const tgt = this.mapLanguage(targetLang);

    if (!tgt) {
      console.warn(`Unsupported target language: ${targetLang}`);
      return text;
    }

    try {
      // Detect source language using franc
      const detectedLang = franc(text);
      const src = this.francToNllb[detectedLang] || 'spa_Latn'; // Default to Spanish if unknown

      console.log(`Detected language: ${detectedLang} -> ${src}`);
      console.log(`Translating from ${src} to ${tgt}`);

      const options: any = {
        tgt_lang: tgt,
        src_lang: src,
      };

      // @ts-ignore
      const result = await this.translator(text, options);

      let translatedText = text;
      if (Array.isArray(result) && result.length > 0) {
        translatedText = result[0].translation_text;
      } else if (typeof result === 'object' && (result as any).translation_text) {
        translatedText = (result as any).translation_text;
      }

      console.log(`Translation complete`);

      this.cache.set(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  public async translateBulk(strings: string[], targetLang: string): Promise<string[]> {
    if (!strings || strings.length === 0) return [];

    const results: string[] = [];
    for (const text of strings) {
      results.push(await this.translate(text, targetLang));
    }

    return results;
  }

  private mapLanguage(lang: string): string | null {
    if (!lang) return null;
    if (lang === 'auto') return 'auto';

    if (this.langMap[lang]) return this.langMap[lang];

    const normalized = lang.split('-')[0];
    if (this.langMap[normalized]) return this.langMap[normalized];

    return null;
  }

  public async isModelLoaded(): Promise<boolean> {
    await this.storage.ensureReady();
    // Check if model was previously loaded successfully
    const isModelCached = await this.storage.get('model_loaded');

    console.log('Loading translation model:', this.modelName);
    if (isModelCached) {
      console.log('Translation model already loaded!');
      this.modelDownloadProgress$.next(100);
      return true;
    }
    return false;
  }

}
