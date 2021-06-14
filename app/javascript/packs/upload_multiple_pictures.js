import '../styles';

class UploadMultiplePictures {
  constructor(el, option) {
    this.el = el;
    this.inputUrlName = 'thumb_images[]';
    this.inputIdName = 'images_encryped_ids[]';
    // this.inputsTarget = option.inputsTarget;
    this.keyPrefix = 'upload-multiple-pictures__input_';
    this.init();
  }

  init() {
    this.el.innerHTML = `<div class="upload-multiple-pictures__item upload-multiple-pictures__item__add">
                          <span>上传</span>
                        </div>
                        <div class="upload-multiple-pictures__inputs" data-multiple-upload-target="inputs"></div>`;

    this.addActionElement = this.el.querySelector('.upload-multiple-pictures__item__add');
    this.inputsElement = this.el.querySelector('.upload-multiple-pictures__inputs');
    this.addItemEvent();
  }

  /**
   *
   * @param {Object} option {key: null, image_url: null, eid: null}
   * @param {Function} cb callback function
   * @returns
   */
  createUploadItem(option = {}, cb = () => {}) {
    let { key, image_url, eid } = option;

    let itemHtml = document.createElement('div');
    let itemHtml__cover = document.createElement('div');
    let itemHtml__cover__remove = document.createElement('span');
    let itemHtml__cover__preview = document.createElement('span');

    itemHtml.setAttribute('class', 'upload-multiple-pictures__item');
    itemHtml.setAttribute('data-for', '#' + this.keyPrefix + key);
    itemHtml__cover.setAttribute('class', 'upload-multiple-pictures__item__cover');
    itemHtml__cover__remove.setAttribute('class', 'upload-multiple-pictures__item__remove');
    itemHtml__cover__remove.innerText = '删除';
    itemHtml__cover__preview.setAttribute('class', 'upload-multiple-pictures__item__preview');

    itemHtml__cover__preview.innerText = '预览';

    itemHtml.style.backgroundImage = `url(${image_url})`;
    itemHtml.style.backgroundRepeat = 'no-repeat';
    itemHtml.style.backgroundSize = 'cover';
    itemHtml.style.backgroundPosition = 'center center';

    itemHtml__cover.appendChild(itemHtml__cover__remove);
    itemHtml__cover.appendChild(itemHtml__cover__preview);
    itemHtml.appendChild(itemHtml__cover);

    this.el.insertBefore(itemHtml, this.addActionElement);

    if (typeof cb !== 'function') {
      return console.info('warning: cb is not a function!');
    };

    const removeTarget = this.el.querySelector('[data-for="#'+ this.keyPrefix + key +'"] .upload-multiple-pictures__item__remove');
    cb(removeTarget, key);
  }

  /**
   *
   * @param {Object} option {key: null, image_url: null, eid: null}
   */
  createUploadInput(option = {}) {
    let { key, image_url, eid } = option;

    let inputItemEl = document.createElement('div')
    let inputUrlEl = document.createElement('input');
    let inputIdEl = document.createElement('input');

    inputItemEl.setAttribute('id', this.keyPrefix + key);
    inputUrlEl.setAttribute('type', 'hidden');
    inputUrlEl.setAttribute('name', this.inputUrlName);
    inputUrlEl.setAttribute('value', image_url);
    inputIdEl.setAttribute('type', 'hidden');
    inputIdEl.setAttribute('name', this.inputIdName);
    inputIdEl.setAttribute('value', eid);

    inputItemEl.appendChild(inputUrlEl);
    inputItemEl.appendChild(inputIdEl);
    this.inputsElement.appendChild(inputItemEl);
  }

  /**
   * @description
   */
  addItemEvent() {
    let self = this;

    this.addActionElement.addEventListener('click', function(e) {
      // TODO 上传附件
      // TODO 点击上传图片 -> 创建上传item -> 加载上传进度 -> 上传回调处理
      let result = {
        key: `${(new Date).getTime()}-${parseInt(Math.random() * 100)}`,
        image_url: '/assets/default_headshot_new-0373bfc6d2edc5659f77060dee749386e0e5135049dc3ebe3197f83a465e15f0.png',
        eid: 'asdfasdfasdfasdfasdf'
      }

      self.createUploadItem(result, (el, key) => {
        self.removeActionEvent(el, key);
      });
      self.createUploadInput(result);
    });
  }

  /**
   *
   * @param {Element} el remove element
   * @param {String} key
   */
  removeActionEvent(el, key) {
    let self = this;

    el.addEventListener('click', function() {
      let uploadItem = self.el.querySelector('[data-for="#' + self.keyPrefix + key +'"]');
      let inputsItem = document.getElementById(self.keyPrefix + key);

      self.inputsElement.removeChild(inputsItem);
      self.el.removeChild(uploadItem);
    })
  }
}

export default UploadMultiplePictures;
