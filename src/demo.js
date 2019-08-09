console.log('hello');
import Writer from './packages/main';
import './styles/demo.less';

const writer = new Writer({
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight / 2
});

const methods = {
  clear: writer.clear,
  output: () => {
	const img = getImage();
	img.src = writer.output();
  },
  download: () => writer.download()
};

const getImage = (function () {
  let img;

  return function () {
	if (img) return img;
	img = new Image();
	img.style.width = '100%';
	document.body.appendChild(img);
	return img;
  };
})();

const options = {
  color: value => writer.$options.color = value,
  lineWidth: value => writer.$options.lineWidth = value,
};

console.log(writer);

function appendBtn() {
  const frag = document.createDocumentFragment();
  for (let key in methods) {
	const btn = document.createElement('button');
	btn.id = key;
	btn.addEventListener('click', methods[key]);
	btn.innerText = key;
	frag.appendChild(btn);
  }
  document.body.appendChild(frag);
}

function appendInput() {
  const frag = document.createDocumentFragment();
  for (let key in options) {
	const input = document.createElement('input');
	input.setAttribute('placeholder', `请输入${key}`);
	if (key === 'color') {
	  input.type = 'color';
	}
	if (key === 'lineWidth') {
	  input.type = 'range';
	  input.min = 1;
	  input.max = 30;
	}
	input.addEventListener('input', e => options[key](e.target.value));
	frag.appendChild(input);
  }
  document.body.appendChild(frag);
}

appendBtn();
appendInput();
