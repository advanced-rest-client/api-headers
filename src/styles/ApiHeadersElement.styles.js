import { css } from 'lit-element';

export default css`
api-form-item {
  flex: 1;
  margin: 10px 0;
}

.form-row {
  min-height: 48px;
}

:host([compatibility]) api-form-item {
  margin-bottom: 30px;
  margin-top: 25px;
}
`;
