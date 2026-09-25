import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';

import { appConfig } from './app/app.config';


bootstrapApplication(
  App,
  appConfig
)
  .catch((error) => {

    console.error(
      'ShopNest application failed to start:',
      error
    );

  });