import { setProgressBarDelay } from 'turbolinks';
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
    this.el.innerHTML = `<label class="upload-multiple-pictures__item upload-multiple-pictures__item__add">
                          <span>上传</span>
                          <input type="file">
                        </label>
                        <div class="upload-multiple-pictures__inputs" data-multiple-upload-target="inputs"></div>`;

    this.uploadContainerElement = this.el.querySelector('.upload-multiple-pictures__item__add');
    this.uploadElement = this.uploadContainerElement.querySelector('input[type="file"]');
    this.inputsElement = this.el.querySelector('.upload-multiple-pictures__inputs');
    this.uploadInputEvent();
  }

  /**
   * @description 初始化图片模块
   * @param {Object} option {key: null, url: null, eid: null}
   * @param {Function} cb callback function
   * @returns
   */
  initImageBlock(option = {}) {
    let { key, url, eid } = option;

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

    itemHtml.style.backgroundImage = `url(${url})`;
    itemHtml.style.backgroundRepeat = 'no-repeat';
    itemHtml.style.backgroundSize = 'cover';
    itemHtml.style.backgroundPosition = 'center center';

    itemHtml__cover.appendChild(itemHtml__cover__remove);
    itemHtml__cover.appendChild(itemHtml__cover__preview);
    itemHtml.appendChild(itemHtml__cover);

    this.el.insertBefore(itemHtml, this.uploadContainerElement);

    // 添加删除和预览事件
    const removeElement = this.el.querySelector('[data-for="#'+ this.keyPrefix + key +'"] .upload-multiple-pictures__item__remove');
    this.addRemoveEvent(removeElement, key);
  }

  /**
   * @description 初始化inputs元素, 用于form提交的参数
   * @param {Object} option {key: null, url: null, eid: null}
   */
  initFormInputs(option = {}) {
    let { key, url, eid } = option;

    let inputItemEl = document.createElement('div')
    let inputUrlEl = document.createElement('input');
    let inputIdEl = document.createElement('input');

    inputItemEl.setAttribute('id', this.keyPrefix + key);
    inputUrlEl.setAttribute('type', 'hidden');
    inputUrlEl.setAttribute('name', this.inputUrlName);
    inputUrlEl.setAttribute('value', url);
    inputIdEl.setAttribute('type', 'hidden');
    inputIdEl.setAttribute('name', this.inputIdName);
    inputIdEl.setAttribute('value', eid);

    inputItemEl.appendChild(inputUrlEl);
    inputItemEl.appendChild(inputIdEl);

    this.inputsElement.appendChild(inputItemEl);
  }

  /**
   * @description 处理上传的图片（当前处理方式: 转base64直接访问上传的图片）
   * @todo 加载进度
   * @param {File} file
   */
  handleUploadFile(file) {
    const self = this;
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function(event) {
      // TODO 参数需要补充
      let data = {
        key: `${(new Date).getTime()}-${parseInt(Math.random() * 100)}`,
        url: event.target.result,
        eid: ''
      }

      self.appendUploadedImageBlock(data);
    }
  }

  /**
   * @description 在页面中添加一个上传成功的图片模块
   * @param {Object} data
   */
  appendUploadedImageBlock(data) {
    this.initImageBlock(data);
    this.initFormInputs(data);
  }

  /**
   * @description 上传图片onchange事件
   */
  uploadInputEvent() {
    const self = this;

    this.uploadElement.addEventListener('input', function(e) {
      const file = this.files[0];

      // TODO file 验证
      if (!!file) {
        this.value = '';
        console.log(file);
        self.handleUploadFile(file);
      }
    });
  }

  /**
   * @description 删除按钮事件
   * @param {Element} el 图片模块中的删除元素
   * @param {String} key
   */
  addRemoveEvent(el, key) {
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
