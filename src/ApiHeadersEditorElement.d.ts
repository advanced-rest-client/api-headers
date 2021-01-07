/* eslint-disable class-methods-use-this */
/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { HeadersEditorElement } from '@advanced-rest-client/arc-headers';
import { headerToggleTemplate, addTemplate, emptyTemplate, editorSwitchTemplate, formHeaderTemplate, createViewModel, headerItemTemplate, headerNameInput, headerValueInput, contentActionsTemplate } from '@advanced-rest-client/arc-headers/src/internals.js';
import { ApiFormMixin, ApiViewModel, apiFormStyles } from '@api-components/api-forms';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';
import { CSSResult, TemplateResult } from 'lit-element';
import { AmfFormItem } from '@advanced-rest-client/arc-types/src/forms/FormTypes';

export const amfHeadersValue: unique symbol;
export const optionalToggleTemplate: unique symbol;
export const optionalHandler: unique symbol;
export const apiFormHandler: unique symbol;

/**
 * An element to render a HTTP headers editor based on the AMF data model.
 */
export declare class ApiHeadersEditorElement extends ApiFormMixin(AmfHelperMixin(HeadersEditorElement)) {
  get styles(): CSSResult[];

  /**
   * List of headers defined in AMF model to render.
   */
  amfHeaders: any;
  /**
   * When set only form editor is available.
   *
   * Note, because of dependency, you still have to import CodeMirror
   * or at lease provide a mock function for registering addons.
   *
   * See @advanced-rest-client/code-mirror-hint for used functions.
   * @attribute
   */
  noSourceEditor: boolean;

  viewFactory: ApiViewModel;

  model: AmfFormItem[];
  
  constructor();

  /**
   * Computes view model used by the element from the AMF headers
   */
  computeDataModel(value: any): AmfFormItem[];

  /**
   * @param {any} amf 
   */
  __amfChanged(amf: any): void;

  /**
   * Adds a header to the list of headers
   */
  add(): void;

  /**
   * Parses headers string to a view model.
   * @param input
   * @returns View model for the headers.
   */
  [createViewModel](input: string): AmfFormItem[];

  [optionalHandler](e: Event): void;

  [apiFormHandler](e: Event): void;

  render(): TemplateResult;

  /**
   * @return Template for the parameter name input
   */
  [headerToggleTemplate](item: AmfFormItem, index: number): TemplateResult;

  /**
   * @returns a template for the empty list view
   */
  [addTemplate](): TemplateResult;

  /**
   * @returns a template for the empty list view
   */
  [emptyTemplate](): TemplateResult;

  [headerItemTemplate](item: AmfFormItem, index: number): TemplateResult;

  /**
   * @returns a template for the content actions
   */
  [contentActionsTemplate](): TemplateResult;

  /**
   * @returns a template for the content actions
   */
  [editorSwitchTemplate](): TemplateResult;

  /**
   * @return Template for the toggle optional switch
   */
  [optionalToggleTemplate](): TemplateResult|string;

  /**
   * @return Template for the parameter name input
   */
  [headerNameInput](item: AmfFormItem, index: number): TemplateResult;

  /**
   * @return Template for the parameter value input
   */
  [headerValueInput](item: AmfFormItem, index: number): TemplateResult;

  [formHeaderTemplate](): TemplateResult;
}
