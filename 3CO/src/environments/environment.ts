// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  passphrase: '752496As5sdGT?=5a6ZX',
  AESiv: '100a101000111101100101AFde',
  paths: {
    base_api: 'https://28grdo-ip-2-57-109-7.tunnelmole.net/v2/api/',
    base_detection_api: 'https://28grdo-ip-2-57-109-7.tunnelmole.net/v2/api/',
    post_get_user: 'user',
    login: 'user/login',
    image_detection: 'detect',
    user_badges:'user_badges'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
