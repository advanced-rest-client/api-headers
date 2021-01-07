import { html } from 'lit-html';
import { ApiDemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '../api-headers-editor.js';

class ApiDemo extends ApiDemoPage {
  constructor() {
    super();

    this.initObservableProperties([
      'allowDisableParams', 'amfHeaders',
      'allowCustom', 'allowHideOptional', 'readOnly', 'outlined', 'compatibility',
      'headers', 'noSourceEditor'
    ]);

    this.allowDisableParams = false;
    this.allowCustom = false;
    this.allowHideOptional = false;
    this.readOnly = false;
    this.noSourceEditor = false;

    this.componentName = 'api-headers-editor';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];
    this._headersHandler = this._headersHandler.bind(this);
    this._mainDemoStateHandler = this._mainDemoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
  }

  _navChanged(e) {
    const { selected, type } = e.detail;
    if (type === 'method') {
      this.setData(selected);
    } else {
      this.amfHeaders = undefined;
      this.hasData = false;
    }
  }

  setData(selected) {
    const webApi = this._computeWebApi(this.amf);
    const method = this._computeMethodModel(webApi, selected);
    const expects = this._computeExpects(method);
    const hKey = this._getAmfKey(this.ns.aml.vocabularies.apiContract.header);
    const headers = this._ensureArray(expects[hKey]);
    this.amfHeaders = headers;
    this.hasData = true;
  }

  _mainDemoStateHandler(e) {
    const state = e.detail.value;
    this.outlined = state === 1;
    this.compatibility = state === 2;
    this._updateCompatibility();
  }

  _headersHandler(e) {
    this.headers = e.target.value;
  }

  _apiListTemplate() {
    const items = [
      'demo-api',
      'APIC-284',
    ];
    return items.map((item) => html`
    <anypoint-item data-src="${item}-compact.json">${item} - compact</anypoint-item>
    <anypoint-item data-src="${item}.json">${item}</anypoint-item>`);
  }

  _demoTemplate() {
    const {
      amf,
      amfHeaders,
      headers,
      allowDisableParams,
      allowCustom,
      allowHideOptional,
      readOnly,
      demoStates,
      darkThemeActive,
      outlined,
      compatibility,
      noSourceEditor
    } = this;
    return html`
    <section class="documentation-section">
      <h3>Interactive demo</h3>
      <p>
        This demo lets you preview the API headers form element with various
        configuration options.
      </p>
      <arc-interactive-demo
        .states="${demoStates}"
        @state-changed="${this._mainDemoStateHandler}"
        ?dark="${darkThemeActive}"
      >
        <api-headers-editor
          slot="content"
          .amf="${amf}"
          .amfHeaders="${amfHeaders}"
          @change="${this._headersHandler}"
          ?allowDisableParams="${allowDisableParams}"
          ?allowCustom="${allowCustom}"
          ?allowHideOptional="${allowHideOptional}"
          ?readonly="${readOnly}"
          ?outlined="${outlined}"
          ?compatibility="${compatibility}"
          ?noSourceEditor="${noSourceEditor}"
        ></api-headers-editor>

        <label slot="options" id="mainOptionsLabel">Options</label>
        <anypoint-checkbox
          aria-describedby="mainOptionsLabel"
          slot="options"
          name="allowDisableParams"
          @change="${this._toggleMainOption}"
          >Allow disable</anypoint-checkbox
        >
        <anypoint-checkbox
          aria-describedby="mainOptionsLabel"
          slot="options"
          name="allowHideOptional"
          @change="${this._toggleMainOption}"
          >Allow hide</anypoint-checkbox
        >
        <anypoint-checkbox
          aria-describedby="mainOptionsLabel"
          slot="options"
          name="allowCustom"
          @change="${this._toggleMainOption}"
          >Allow custom</anypoint-checkbox
        >
        <anypoint-checkbox
          aria-describedby="mainOptionsLabel"
          slot="options"
          name="noSourceEditor"
          @change="${this._toggleMainOption}"
          >No source editor</anypoint-checkbox
        >
        <anypoint-checkbox
          aria-describedby="mainOptionsLabel"
          slot="options"
          name="readOnly"
          @change="${this._toggleMainOption}"
          >Read only</anypoint-checkbox
        >
      </arc-interactive-demo>

      <output>${headers}</output>
    </section>`;
  }

  _standaloneTemplate() {
    return html`<section class="documentation-section">
      <h3>Standalone editor</h3>
      <p>
        The headers editor can be used without providing data model.
      </p>

      <api-headers-editor
        allowDisableParams
        allowCustom
        allowHideOptional></api-headers-editor>
    </section>`;
  }

  contentTemplate() {
    return html`
    <h2 class="centered main">API headers editor</h2>
    ${this._demoTemplate()}
    ${this._standaloneTemplate()}
    `;
  }
}
const instance = new ApiDemo();
instance.render();
