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

import cloneDeep from "lodash/cloneDeep"
import merge from "lodash/merge"
import { ThemeConfig } from "./types"
import { CustomThemeConfig } from "src/proto"

describe("themeConfigs", () => {
  let originalLightTheme: ThemeConfig
  let originalDarkTheme: ThemeConfig

  beforeEach(async () => {
    const module = await import("./themeConfigs")
    originalLightTheme = module.lightTheme
    originalDarkTheme = module.darkTheme
    jest.resetModules()
    window.__streamlit = undefined
  })

  afterEach(() => {
    jest.resetModules()
    window.__streamlit = undefined
  })

  it("honors the window variables set", async () => {
    window.__streamlit = {
      LIGHT_THEME: {
        primaryColor: "purple",
      },
      DARK_THEME: {
        primaryColor: "yellow",
      },
    }

    const module = await import("./themeConfigs")
    // Ensure we are not working with the same object
    expect(module.lightTheme).not.toEqual(originalLightTheme)
    expect(module.darkTheme).not.toEqual(originalDarkTheme)

    expect(module.lightTheme.emotion.colors.primary).toEqual("purple")
    expect(module.darkTheme.emotion.colors.primary).toEqual("yellow")
  })

  it("maintains original theme if no global themes are specified", async () => {
    const module = await import("./themeConfigs")
    expect(module.lightTheme).toEqual(originalLightTheme)
    expect(module.darkTheme).toEqual(originalDarkTheme)
  })
})
