import { fixture, assert, nextFrame, aTimeout, html } from '@open-wc/testing';
import * as sinon from 'sinon';
import { ApiViewModel } from '@api-components/api-forms';
import { AmfLoader } from './amf-loader.js';
import '../api-headers-editor.js';

/** @typedef {import('../').ApiHeadersEditorElement} ApiHeadersEditorElement */

describe('ApiHeadersEditorElement', () => {
  /**
   * @returns {Promise<ApiHeadersEditorElement>}
   */
  async function basicFixture() {
    return fixture(html`<api-headers-editor></api-headers-editor>`);
  }

  /**
   * @returns {Promise<ApiHeadersEditorElement>}
   */
  async function readonlyFixture() {
    return fixture(html`<api-headers-editor readonly></api-headers-editor>`);
  }

  /**
   * @returns {Promise<ApiHeadersEditorElement>}
   */
  async function noSourceFixture() {
    return fixture(html`<api-headers-editor noSourceEditor></api-headers-editor>`);
  }

  describe('Basics', () => {
    let element = /** @type ApiHeadersEditorElement */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('value is not set', () => {
      assert.notOk(element.value);
    });
  });

  describe('Switching editors', () => {
    let element = /** @type ApiHeadersEditorElement */ (null);
    beforeEach(async () => {
      element = await basicFixture();
      element.apiModel = [
        {
          name: 'x-test',
          enabled: true,
          schema: {
            required: true,
            type: 'string',
            inputLabel: 'x-string',
            isArray: false,
            isBool: false,
            inputType: 'text',
          },
          value: '',
        },
      ];
      element.model = element.apiModel;
      await nextFrame();
    });

    it('Form data is the default editor', () => {
      const editor = element.shadowRoot.querySelector('.params-list');
      assert.ok(editor);
    });

    it('Code mirror is not in the DOM', () => {
      const editor = element.shadowRoot.querySelector('code-mirror');
      assert.notOk(editor);
    });

    it('Switching to source mode removes form items', async () => {
      element.source = true;
      await nextFrame();
      const editor = element.shadowRoot.querySelector('.params-list');
      assert.notOk(editor);
    });

    it('Switching to source mode add code mirror', async () => {
      element.source = true;
      await nextFrame();

      const editor = element.shadowRoot.querySelector('code-mirror');
      assert.ok(editor);
    });
  });

  describe('read only mode', () => {
    let element = /** @type ApiHeadersEditorElement */ (null);
    beforeEach(async () => {
      element = await readonlyFixture();
    });

    it('passes the flag to source editor', async () => {
      element.source = true;
      await nextFrame();
      const node = /** @type any */ (element.shadowRoot.querySelector('code-mirror'));
      assert.isTrue(node.readonly);
    });
  });

  describe('No source mode', () => {
    let element = /** @type ApiHeadersEditorElement */ (null);
    beforeEach(async () => {
      element = await noSourceFixture();
    });

    it('does not render source toggle button', () => {
      const node = element.shadowRoot.querySelector('[data-action="source"]');
      assert.notOk(node);
    });
  });

  describe('AMF model tests', () => {
    function getHeadersModel(element, amfModel) {
      const webApi = element._computeWebApi(amfModel);
      const endpoint = element._computeEndpointByPath(webApi, '/endpoint');
      const opKey = element._getAmfKey(
        element.ns.aml.vocabularies.apiContract.supportedOperation
      );
      const ops = element._ensureArray(endpoint[opKey]);
      const expects = element._computeExpects(ops[0]);
      const hKey = element._getAmfKey(
        element.ns.aml.vocabularies.apiContract.header
      );
      return element._ensureArray(expects[hKey]);
    }

    [
      ['Full model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let amfModel;
        before(async () => {
          amfModel = await AmfLoader.load(item[1]);
        });

        let element = /** @type ApiHeadersEditorElement */ (null);
        beforeEach(async () => {
          const factory = new ApiViewModel();
          factory.clearCache();
          element = await basicFixture();
          element.amf = amfModel;
          element.amfHeaders = getHeadersModel(element, amfModel);
          await nextFrame();
        });

        it('Generates view model from AMF shape', () => {
          assert.typeOf(element.apiModel, 'array');
          assert.lengthOf(element.apiModel, 19);
        });

        it('Model respects default values', () => {
          const xRequired = element.apiModel[4];
          assert.equal(xRequired.value, 'default required value');
        });

        it('generates value from the model', () => {
          const { value } = element;
          assert.notInclude(value, 'ETag', 'Etag is not present (optional)');
          assert.include(value, 'Cache-Control', 'Cache-Control is present');
          assert.include(value, 'x-string', 'x-string is present');
          assert.notInclude(value, 'x-optional', 'x-optional is not present (optional)');
          assert.include(value, 'x-required: default required value', 'x-required is present (default value)');
          assert.include(value, 'x-union: Hello union', 'x-union is present (value from example)');
        });
      });
    });
  });

  describe('a11y', () => {
    it('is accessible when empty', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });

    it('is accessible with value', async () => {
      const element = await basicFixture();
      element.value = 'content-type: application/json\naccept: */*\netag: test';
      await nextFrame();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });

    it('is accessible with sourceEditor', async () => {
      const element = await basicFixture();
      element.source = true;
      element.value = 'content-type: application/json\naccept: */*\netag: test';
      await nextFrame();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });
  });
});
