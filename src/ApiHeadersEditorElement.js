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
import { notifyValueChange, headerToggleTemplate, addTemplate, emptyTemplate, editorSwitchTemplate, copyActionButtonTemplate, formHeaderTemplate, propagateModelChange, createViewModel, headerItemTemplate, headerNameInput, headerValueInput, headerRemoveTemplate, contentActionsTemplate } from '@advanced-rest-client/arc-headers/src/internals.js';
import { ApiFormMixin, ApiViewModel, apiFormStyles } from '@api-components/api-forms';
import { isOptional } from '@api-components/api-forms/src/Utils.js';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';
import { html } from 'lit-element';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';
import '@api-components/api-forms/api-form-item.js';
import elementStyles from './styles/ApiHeadersElement.styles.js';

/** @typedef {import('@advanced-rest-client/arc-types').FormTypes.AmfFormItem} AmfFormItem */
/** @typedef {import('lit-element').TemplateResult} TemplateResult */

export const amfHeadersValue = Symbol('amfHeadersValue');
export const optionalToggleTemplate = Symbol('optionalToggleTemplate');
export const optionalHandler = Symbol('optionalHandler');
export const apiFormHandler = Symbol('apiFormHandler');
const consolidateWithAmfHeaders = Symbol('consolidateWithAmfHeaders');

/**
 * An element to render a HTTP headers editor based on the AMF data model.
 */
export class ApiHeadersEditorElement extends ApiFormMixin(AmfHelperMixin(HeadersEditorElement)) {
  get styles() {
    return [
      apiFormStyles,
      HeadersEditorElement.styles,
      elementStyles,
    ];
  }

  static get properties() {
    return {
      /**
       * List of headers defined in AMF model to render.
       */
      amfHeaders: { type: Array },
      /**
       * When set only form editor is available.
       *
       * Note, because of dependency, you still have to import CodeMirror
       * or at lease provide a mock function for registering addons.
       *
       * See @advanced-rest-client/code-mirror-hint for used functions.
       */
      noSourceEditor: { type: Boolean },
    };
  }

  get amfHeaders() {
    return this[amfHeadersValue];
  }

  set amfHeaders(value) {
    const old = this[amfHeadersValue];
    /* istanbul ignore if  */
    if (old === value) {
      return;
    }
    this[amfHeadersValue] = value;
    this.model = this.computeDataModel(value);
    this.apiModel = this.model;
    this.requestUpdate();
    this[notifyValueChange]();
  }
  
  constructor() {
    super();
    this.viewFactory = new ApiViewModel();
    this.noSourceEditor = false;
    /**
     * @type AmfFormItem[]
     */
    this.model = undefined;
  }

  /**
   * Computes view model used by the element from the AMF headers
   * @param {any} value 
   * @returns {AmfFormItem[]}
   */
  computeDataModel(value) {
    return this.viewFactory.computeViewModel(value);
  }

  /**
   * @param {any} amf 
   */
  __amfChanged(amf) {
    this.viewFactory.amf = amf;
  }

  /**
   * Adds a header to the list of headers
   */
  add() {
    if (!this.allowCustom) {
      return;
    }
    this.addCustom();
    this.model = this.apiModel;
  }

  /**
   * Parses headers string to a view model.
   * @param {string} input
   * @returns {AmfFormItem[]} View model for the headers.
   */
  [createViewModel](input) {
    const result = /** @type AmfFormItem[] */ (super[createViewModel](input));
    const { apiModel=[] } = this;
    this[consolidateWithAmfHeaders](result);
    result.forEach((item) => {
      if (!item.schema) {
        // eslint-disable-next-line no-param-reassign
        item.schema = {};
      }
      const previous = apiModel.find((i) => i.name === item.name);
      if (!previous || !previous.schema || previous.schema.isCustom) {
        // eslint-disable-next-line no-param-reassign
        item.schema.isCustom = true;
      }
    });
    return result;
  }

  [optionalHandler](e) {
    this.optionalOpened = e.target.checked;
  }

  [apiFormHandler](e) {
    const node = /** @type HTMLInputElement */ (e.target);
    const index = Number(node.dataset.index);
    const item = this.apiModel[index];
    item.value = node.value;
    this[propagateModelChange]();
    this[notifyValueChange]();
  }

  render() {
    return html`
    <style>${this.styles}</style>
    ${super.render()}
    `;
  }

  /**
   * @param {AmfFormItem} item
   * @param {number} index
   * @return {TemplateResult} Template for the parameter name input
   */
  [headerToggleTemplate](item, index) {
    if (!this.allowDisableParams) {
      return html``;
    }
    return super[headerToggleTemplate](item, index);
  }

  /**
   * @returns {TemplateResult} a template for the empty list view
   */
  [addTemplate]() {
    if (!this.allowCustom) {
      return html``;
    }
    return super[addTemplate]();
  }

  /**
   * @returns {TemplateResult} a template for the empty list view
   */
  [emptyTemplate]() {
    if (!this.allowCustom) {
      return html`<p>No headers are defined for this endpoint</p>`;
    }
    return super[emptyTemplate]();
  }

  /**
   * @param {AmfFormItem} item
   * @param {number} index
   * @return {TemplateResult}
   */
  [headerItemTemplate](item, index) {
    return html`
    <div class="form-row form-item" ?data-optional="${isOptional(this.hasOptional, item)}">
      ${this[headerToggleTemplate](item, index)}
      ${this[headerNameInput](item, index)}
      ${this[headerValueInput](item, index)}
      ${this[headerRemoveTemplate](index)}
    </div>`;
  }

  /**
   * @returns {TemplateResult} a template for the content actions
   */
  [contentActionsTemplate]() {
    return html`
    <div class="content-actions">
      ${this[copyActionButtonTemplate]()}
      ${this[editorSwitchTemplate]()}
      ${this[optionalToggleTemplate]()}
    </div>
    `;
  }

  /**
   * @returns {TemplateResult} a template for the content actions
   */
  [editorSwitchTemplate]() {
    if (this.noSourceEditor) {
      return html``;
    }
    return super[editorSwitchTemplate]();
  }

  /**
   * @return {TemplateResult|string} Template for the toggle optional switch
   */
  [optionalToggleTemplate]() {
    if (!this.renderOptionalCheckbox) {
      return '';
    }
    return html`
    <anypoint-switch
      class="toggle-checkbox"
      .checked="${this.optionalOpened}"
      @checked-changed="${this[optionalHandler]}"
      title="Toggles visibility of optional parameters"
    >Show optional</anypoint-switch>
    `;
  }

  /**
   * @param {AmfFormItem} item
   * @param {number} index
   * @return {TemplateResult} Template for the parameter name input
   */
  [headerNameInput](item, index) {
    const { schema={} } = item;
    if (schema.isCustom) {
      return super[headerNameInput](item, index);
    }
    return html`
    <api-form-item
      data-index="${index}"
      .name="${item.name}"
      .value="${item.value}"
      @change="${this[apiFormHandler]}"
      .model="${item}"
      ?required="${schema.required}"
      .readOnly="${this.readOnly || schema.readOnly}"
      ?outlined="${this.outlined}"
      ?compatibility="${this.compatibility}"
    ></api-form-item>
    `;
  }

  /**
   * @param {AmfFormItem} item
   * @param {number} index
   * @return {TemplateResult} Template for the parameter value input
   */
  [headerValueInput](item, index) {
    const { schema={} } = item;
    if (schema.isCustom) {
      return super[headerValueInput](item, index);
    }
    return html``;
  }

  [formHeaderTemplate]() {
    return html``;
  }

  /**
   * For a list of header form items, if the header is defined by the model,
   * copy the original header's schema into the current header's schema
   * @param {AmfFormItem[]} formItems
   */
  [consolidateWithAmfHeaders](formItems) {
    const amfHeaders = this.computeDataModel(this[amfHeadersValue]);
    if (!amfHeaders || !formItems) {
      return;
    }
    formItems.forEach(item => {
      const amfHeader = amfHeaders.find(header => header.name === item.name);
      if (amfHeader) {
        // eslint-disable-next-line no-param-reassign
        item.schema = { ...(item.schema || {}), ...amfHeader.schema };
      }
    });
  }
}
