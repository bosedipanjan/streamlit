/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2024)
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

import { lightThemePrimitives, darkThemePrimitives } from "baseui"
import isObject from "lodash/isObject"
import merge from "lodash/merge"
import { baseuiLightTheme, baseuiDarkTheme } from "./baseui"
import emotionBaseTheme from "./emotionBaseTheme"
import emotionLightTheme from "./emotionLightTheme"
import emotionDarkTheme from "./emotionDarkTheme"
import { ThemeConfig } from "./types"
import { CustomThemeConfig, ICustomThemeConfig } from "../proto"
import { createTheme } from "./utils"

declare global {
  interface Window {
    __streamlit?: {
      LIGHT_THEME: ICustomThemeConfig
      DARK_THEME: ICustomThemeConfig
    }
  }
}

function mergeTheme(
  theme: ThemeConfig,
  injectedTheme: ICustomThemeConfig | undefined
): ThemeConfig {
  // We confirm the injectedTheme is a valid object before merging it
  // since the type makes assumption about the implementation of the
  // injected object.
  if (injectedTheme && isObject(injectedTheme)) {
    const themeConfigProto = new CustomThemeConfig(injectedTheme)
    const customTheme = createTheme(theme.name, themeConfigProto, theme)
    return merge({}, theme, customTheme)
  }

  return theme
}

export const baseTheme: ThemeConfig = {
  name: "base",
  emotion: emotionBaseTheme,
  basewebTheme: baseuiLightTheme,
  primitives: lightThemePrimitives,
}

export const darkTheme: ThemeConfig = mergeTheme(
  {
    name: "Dark",
    emotion: emotionDarkTheme,
    basewebTheme: baseuiDarkTheme,
    primitives: darkThemePrimitives,
  },
  window.__streamlit?.DARK_THEME
)

export const lightTheme: ThemeConfig = mergeTheme(
  {
    name: "Light",
    emotion: emotionLightTheme,
    basewebTheme: baseuiLightTheme,
    primitives: lightThemePrimitives,
  },
  window.__streamlit?.LIGHT_THEME
)
