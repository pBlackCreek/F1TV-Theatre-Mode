let enabled = false;

const waitForElement = async (selector) => {
	while (document.querySelector(selector) === null) {
		await new Promise((resolve) => requestAnimationFrame(resolve));
	}
	return document.querySelector(selector);
};

const waitForAllElements = async (selector) => {
	while (document.querySelector(selector) === null) {
		await new Promise((resolve) => requestAnimationFrame(resolve));
	}
	return document.querySelectorAll(selector);
};

const theatreModeButton = () => {
	const button = document.createElement('button')
	button.classList.add('bmpui-ui-fullscreentogglebutton')
	button.id = 'theatre-mode-button';
	button.innerHTML = '<svg height="24" version="1.1" viewBox="0 0 36 36" width="24"><use class="ytp-svg-shadow" xlink:href="#ytp-id-45"></use><path d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z" fill="#fff" fill-rule="evenodd" id="ytp-id-45"></path></svg>'
	button.addEventListener('click', button => {
		toggleTheatreMode()
	})
	return button;
}

const toggleTheatreMode = async () => {
	const container = await waitForElement('.vod-detail-page > .container-lg')
	const video = await waitForElement('#app > div > main > div:nth-child(1) > div > div > div > div.inset-video-item-image-container.position-relative.d-flex');
	if (!enabled) {
		container.style.maxWidth = '100vw'
		video.style.height = '80vh'
	} else {
		container.style.maxWidth = ''
		video.style.height = ''
	}
	enabled = !enabled;
}

const addtoggleTheatreModeButton = () => {
	waitForElement('.bmpui-controlbar-bottom > .bmpui-container-wrapper').then(element => {
		if (!document.getElementById('theatre-mode-button'))
			element.appendChild(theatreModeButton())
	})
}

const watchLive = () => {
	waitForElement('.btn.btn-controls.btn-main.btn-manage-account.no-redirect').then( element => {
		element.click();
	})
}

let lastUrl = location.href; 
new MutationObserver(() => {
	const url = location.href;
	if (url !== lastUrl) {
		lastUrl = url;
		onUrlChange();
	}
}).observe(document, {subtree: true, childList: true});

function onUrlChange() {
	console.log('URL changed!', location.href);
	watchLive()
	addtoggleTheatreModeButton()

	waitForAllElements('.btn.btn-link.d-flex.align-items-center').then(elements => {
		elements.forEach(el => {
			el.addEventListener('click', () => {
				setTimeout(() => {
					console.log('update?')
					addtoggleTheatreModeButton()
				}, 5 * 1000)
			})
		})
	})
}

onUrlChange()