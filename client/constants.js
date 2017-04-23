/**
 *
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const constants = {

  APP_NAME: 'Bamusic',

  // Half a meg chunks.
  CHUNK_SIZE: 1024 * 512,

  SUPPORTS_CACHING: ('caches' in self),
  SUPPORTS_BACKGROUND_FETCH: ('BackgroundFetchManager' in self),

  // TODO: Make these based on user preference.
  PREFETCH_VIDEO_HEIGHT: 480,
  PREFETCH_MANIFEST: 'mp4/dash.mpd',
  PREFETCH_VIDEO_PATH: '',
  PREFETCH_AUDIO_PATH: '',
  PREFETCH_DEFAULT_BUFFER_GOAL: 60,
  PREFETCH_MIME_TYPE: 'application/octet-stream',

  OFFLINE_VIDEO_HEIGHT: 720,
  OFFLINE_VIDEO_PATH: '',
  OFFLINE_AUDIO_PATH: '',
  OFFLINE_MIME_TYPE: 'application/octet-stream',

  OFFLINE_ASSET_LIST: [],

  PATHS: {
    VIDEOS: '',
    SHAKA: ''
  }
};

export default constants;