import { Injectable } from '@angular/core';

import { GoogleTranslator } from 'anylang/esm/translators';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AnylangService {

  private cache = new Map<string, string>();
  private translator = new GoogleTranslator();

  currentLanguage$ = new BehaviorSubject<string>('en-GB'); // or load from storage

  constructor(private storage: StorageService) {
    this.storage.getPreferredLanguage().then(lang => this.currentLanguage$.next(lang));
  }

  async translate(text: string, targetLang: string): Promise<string> {
    if (!text) return '';

    const cacheKey = `${text}::${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const translated = await this.translator.translate(text, 'auto', targetLang);

    this.cache.set(cacheKey, translated);
    return translated;
  }


  public async translateBulk(strings: string[], targetLang: string): Promise<string[]> {
    if (!strings || strings.length === 0) return [];

    const cacheKey = `${strings.join('::')}::${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!.split('::');
    }

    const translated = await this.translator.translateBatch(strings, 'auto', targetLang);

    this.cache.set(cacheKey, translated.join('::'));
    return translated;
  }


}
