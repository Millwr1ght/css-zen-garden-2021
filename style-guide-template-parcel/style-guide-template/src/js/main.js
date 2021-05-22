/*******************
		color swatch
	********************/
//convert rgba color to hex color
const rbgToHex = function(elem) {
  if (elem.currentStyle) var bg = elem.currentStyle['background-color'];
  else if (window.getComputedStyle)
    var bg = document.defaultView
      .getComputedStyle(elem, null)
      .getPropertyValue('background-color');
  if (bg.search('rgb') == -1) return bg;
  else {
    bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ('0' + parseInt(x).toString(16)).slice(-2);
    }
    return '#' + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
  }
};

//set a label for each color swatch
const colorBoxes = document.querySelectorAll('.cd-color-swatch');
colorBoxes.forEach(function(element) {
  let newElement = document.createElement('b');
  newElement.innerText = rbgToHex(element);
  element.parentNode.appendChild(newElement);
});

/*******************
		buttons
  ********************/

const buttonsWrapper = document.querySelector('#buttons .cd-box'),
  buttonsHtml = buttonsWrapper.innerHTML;
const containerHtml = document.createElement('div');
containerHtml.classList.add('cd-box');
buttonsWrapper.parentNode.appendChild(containerHtml);
buttonsHtmlText = buttonsHtml.split('</button>');

buttonsHtmlText.map(function(value) {
  if (value.indexOf('button') >= 0) {
    const splitText = value.split('class="'),
      block1 = splitText[0] + 'class="';
    block2 = splitText[1].split('"');

    const wrapperElement = document.createElement('p');
    wrapperElement.appendChild(document.createTextNode(block1));
    const spanElement = document.createElement('span');
    spanElement.appendChild(document.createTextNode(block2[0]));
    wrapperElement.appendChild(spanElement);
    containerHtml.appendChild(wrapperElement);
    wrapperElement.appendChild(
      document.createTextNode('"' + block2[1] + '</button>')
    );
  }
});

/*******************
		typography
	********************/
const heading = document.querySelector('#typography h1'),
  headingDescriptionText = heading.children[0],
  body = heading.nextElementSibling,
  bodyDescriptionText = body.children[0];

setTypography(heading, headingDescriptionText);
setTypography(body, bodyDescriptionText);
window.addEventListener('resize', function() {
  setTypography(heading, headingDescriptionText);
  setTypography(body, bodyDescriptionText);
});

function setTypography(element, textElement) {
  const cs = document.defaultView.getComputedStyle(element, null);
  let fontSize = Math.round(cs.fontSize.replace('px', '')) + 'px',
    fontFamily = cs.fontFamily
      .split(',')[0]
      .replace(/\'/g, '')
      .replace(/\"/g, ''),
    fontWeight = cs.fontWeight;
  textElement.innerText = fontWeight + ' ' + fontFamily + ' ' + fontSize;
}

//   /*******************
// 		main  navigation
// 	********************/
const contentSections = document.querySelectorAll('main section');
//build navigation links
const mainNavElement = document.querySelector('.cd-main-nav');
mainNavElement.innerHTML = '';
contentSections.forEach(function(section) {
  let item = document.createElement('li');
  item.innerHTML = `<a href="#${section.id}">${
    section.children[0].innerHTML
  }</a>`;
  mainNavElement.appendChild(item);
});

// open navigation on mobile
document.querySelector('.cd-nav-trigger').addEventListener('click', function() {
  document.querySelector('header').classList.toggle('nav-is-visible');
});
// smooth scroll to the selected section
document.querySelectorAll('.cd-main-nav a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    const header = document.querySelector('header');
    header.classList.remove('nav-is-visible');
    const target = document.querySelector(this.hash),
      topMargin = document.defaultView
        .getComputedStyle(target, null)
        .marginTop.replace('px', ''),
      headerHeight = header.scrollHeight;
    scrollTo(
      document.body,
      parseInt(target.offsetTop - headerHeight - topMargin),
      200
    );
  });
});

function scrollTo(element, to, duration) {
  if (duration <= 0) return;
  var difference = to - element.scrollTop;
  var perTick = (difference / duration) * 10;

  setTimeout(function() {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

//update selected navigation element
window.addEventListener('scroll', function(event) {
  updateNavigation(event.target);
});

function updateNavigation() {
  contentSections.forEach(function(target) {
    const actual = target;
    const cs = document.defaultView.getComputedStyle(actual, null);
    const actualHeight = actual.height,
      topMargin = cs.marginTop.replace('px', ''),
      actualAnchor = document.querySelector(
        '.cd-main-nav a[href="#' + actual.id + '"]'
      );

    if (
      parseInt(
        actual.offsetTop -
          document.querySelector('.cd-main-nav').height -
          topMargin
      ) <= window.scrollY &&
      parseInt(actual.offsetTop + actualHeight - topMargin) > window.scrollY + 1
    ) {
      actualAnchor.classList.add('selected');
    } else {
      actualAnchor.classList.remove('selected');
    }
  });
}
