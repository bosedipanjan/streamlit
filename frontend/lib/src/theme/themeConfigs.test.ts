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
    const newLightTheme = cloneDeep(originalLightTheme)

    newLightTheme.emotion.colors.primary = "purple"

    const newDarkTheme = cloneDeep(originalDarkTheme)

    newDarkTheme.emotion.colors.primary = "yellow"

    window.__streamlit = {
      LIGHT_THEME: {
        name: "Other Light",
        emotion: newLightTheme.emotion,
        basewebTheme: newLightTheme.basewebTheme,
        primitives: newLightTheme.primitives,
      },
      DARK_THEME: {
        name: "Other Dark",
        emotion: newDarkTheme.emotion,
        basewebTheme: newDarkTheme.basewebTheme,
        primitives: newDarkTheme.primitives,
      },
    }

    const module = await import("./themeConfigs")
    // Ensure we are not working with the same object
    expect(newLightTheme).not.toEqual(originalLightTheme)
    expect(newDarkTheme).not.toEqual(originalDarkTheme)

    expect(module.lightTheme).toEqual({
      name: "Other Light",
      emotion: newLightTheme.emotion,
      basewebTheme: newLightTheme.basewebTheme,
      primitives: newLightTheme.primitives,
    })
    expect(module.darkTheme).toEqual({
      name: "Other Dark",
      emotion: newDarkTheme.emotion,
      basewebTheme: newDarkTheme.basewebTheme,
      primitives: newDarkTheme.primitives,
    })
  })

  it("honors the window variables set with deep merge", async () => {
    const newLightTheme = cloneDeep(originalLightTheme)

    newLightTheme.emotion.colors = {
      primary: "purple",
    }

    const newDarkTheme = cloneDeep(originalDarkTheme)

    newDarkTheme.emotion.colors = {
      primary: "yellow",
    }

    window.__streamlit = {
      LIGHT_THEME: {
        name: "Other Light",
        emotion: newLightTheme.emotion,
        basewebTheme: newLightTheme.basewebTheme,
        primitives: newLightTheme.primitives,
      },
      DARK_THEME: {
        name: "Other Dark",
        emotion: newDarkTheme.emotion,
        basewebTheme: newDarkTheme.basewebTheme,
        primitives: newDarkTheme.primitives,
      },
    }

    const module = await import("./themeConfigs")
    // Ensure we are not working with the same object
    expect(newLightTheme).not.toEqual(originalLightTheme)
    expect(newDarkTheme).not.toEqual(originalDarkTheme)

    expect(module.lightTheme).toEqual({
      name: "Other Light",
      emotion: merge({}, originalLightTheme.emotion, newLightTheme.emotion),
      basewebTheme: newLightTheme.basewebTheme,
      primitives: newLightTheme.primitives,
    })
    expect(module.darkTheme).toEqual({
      name: "Other Dark",
      emotion: merge({}, originalDarkTheme.emotion, newDarkTheme.emotion),
      basewebTheme: newDarkTheme.basewebTheme,
      primitives: newDarkTheme.primitives,
    })
  })

  it("maintains original theme if no global themes are specified", async () => {
    const module = await import("./themeConfigs")
    expect(module.lightTheme).toEqual(originalLightTheme)
    expect(module.darkTheme).toEqual(originalDarkTheme)
  })
})
