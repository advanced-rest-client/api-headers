export const AmfLoader = {};
AmfLoader.load = async (compact) => {
  const file = `/demo-api${compact ? '-compact' : ''}.json`;
  const url = `${window.location.protocol}//${window.location.host}/demo/${file}`;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        // @ts-ignore
        data = JSON.parse(e.target.response);
      } catch (ex) {
        reject(ex);
        return;
      }
      resolve(data);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
