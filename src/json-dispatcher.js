var BlockType = {
	TYPE_CODE: 'CODE',
	TYPE_COMMENT: 'COMMENT',
	TYPE_DIVISION: 'DIVISION',
	TYPE_HEADING: 'HEADING',
	TYPE_UNORDERED_LIST: 'UNORDERED_LIST',
	TYPE_ORDERED_LIST: 'ORDERED_LIST',
	TYPE_LIST_ITEM: 'LIST_ITEM',
	TYPE_PARAGRAPH: 'PARAGRAPH',
	TYPE_QUOTE: 'QUOTE'
};

var ContentType = {
	TYPE_CODE: 'CODE',
	TYPE_EMPHASIS: 'EMPHASIS',
	TYPE_IMAGE: 'IMAGE',
	TYPE_LINE_BREAK: 'LINE_BREAK',
	TYPE_LINK: 'LINK',
	TYPE_TEXT: 'TEXT'
};

var KeyNameTranslator = {
	TYPE_DOCUMENT: 'Document',
	TYPE_CODE: 'Code',
	TYPE_COMMENT: 'Comment',
	TYPE_DIVISION: 'Division',
	TYPE_HEADING: 'Heading',
	TYPE_UNORDERED_LIST: 'UnorderedList',
	TYPE_ORDERED_LIST: 'OrderedList',
	TYPE_LIST_ITEM: 'ListItem',
	TYPE_PARAGRAPH: 'Paragraph',
	TYPE_QUOTE: 'Quote',
	TYPE_EMPHASIS: 'Emphasis',
	TYPE_IMAGE: 'Image',
	TYPE_LINE_BREAK: 'LineBreak',
	TYPE_LINK: 'Link',
	TYPE_TEXT: 'Text',
	ATTRIBUTE_COMMON_TYPE: 'type',
	ATTRIBUTE_COMMON_BLOCKS: 'blocks',
	ATTRIBUTE_COMMON_CONTENTS: 'contents',
	ATTRIBUTE_COMMON_LIST_ITEMS: 'items',
	ATTRIBUTE_DOCUMENT_VERSION: 'version',
	ATTRIBUTE_DOCUMENT_VERSION_MAJOR: 'major',
	ATTRIBUTE_DOCUMENT_VERSION_MINOR: 'minor',
	ATTRIBUTE_CODE_CODE: 'code',
	ATTRIBUTE_CODE_HINT: 'hint',
	ATTRIBUTE_COMMENT_COMMENT: 'comment',
	ATTRIBUTE_HEADING_LEVEL: 'level',
	ATTRIBUTE_ORDERED_LIST_START_INDEX: 'startIndex',
	ATTRIBUTE_IMAGE_URI: 'uri',
	ATTRIBUTE_IMAGE_TITLE: 'title',
	ATTRIBUTE_IMAGE_ALTERNATIVE: 'alternative',
	ATTRIBUTE_EMPHASIS_LEVEL: 'level',
	ATTRIBUTE_LINE_BREAK_HARD: 'hard',
	ATTRIBUTE_LINK_URI: 'uri',
	ATTRIBUTE_LINK_TITLE: 'title',
	ATTRIBUTE_TEXT_TEXT: 'text'
};

var DispatcherException = function (message) {
	this.message = message;
	this.name = "DispatcherException";
	this.toString = function () {
		return this.name + ': ' + this.message;
	};
};

var SimpleMarkdomEventDispatcher = BindedJsClass.extend({
	_markdomHandler: null,
	_blocksHasChildStack: null,
	_listHasChildStack: null,
	_contentsHasChildStack: null,
	_headingLevelStack: null,
	_orderedListStartIndexStack: null,
	_emphasisLevelStack: null,
	_linkUriStack: null,
	_linkTitleStack: null,
	construct: function (markdomHandler) {
		this._blocksHasChildStack = new Stack();
		this._listHasChildStack = new Stack();
		this._contentsHasChildStack = new Stack();
		this._headingLevelStack = new Stack();
		this._orderedListStartIndexStack = new Stack();
		this._emphasisLevelStack = new Stack();
		this._linkUriStack = new Stack();
		this._linkTitleStack = new Stack();
		this._markdomHandler = markdomHandler;
	},
	onDocumentBegin: function () {
		this._markdomHandler.onDocumentBegin();
		this._onBlocksBegin();
	},
	onDocumentEnd: function () {
		this._onBlocksEnd();
		this._markdomHandler.onDocumentEnd();
	},
	onCodeBlock: function (code, hint) {
		this._onBlockBegin(BlockType.TYPE_CODE);
		this._markdomHandler.onCodeBlock(code, hint);
		this._onBlockEnd(BlockType.TYPE_CODE);
	},
	onCommentBlock: function (comment) {
		this._onBlockBegin(BlockType.TYPE_COMMENT);
		this._markdomHandler.onCommentBlock(comment);
		this._onBlockEnd(BlockType.TYPE_COMMENT);
	},
	onDivisionBlock: function () {
		this._onBlockBegin(BlockType.TYPE_DIVISION);
		this._markdomHandler.onDivisionBlock();
		this._onBlockEnd(BlockType.TYPE_DIVISION);
	},
	onHeadingBlockBegin: function (level) {
		this._onBlockBegin(BlockType.TYPE_HEADING);
		this._markdomHandler.onHeadingBlockBegin(level);
		this._onContentsBegin();
		this._headingLevelStack.push(level);
	},
	onHeadingBlockEnd: function () {
		this._onContentsEnd();
		this._markdomHandler.onHeadingBlockEnd(this._headingLevelStack.pop());
		this._onBlockEnd(BlockType.TYPE_HEADING);
	},
	onUnorderedListBlockBegin: function () {
		this._onBlockBegin(BlockType.TYPE_UNORDERED_LIST);
		this._markdomHandler.onUnorderedListBlockBegin();
		this._markdomHandler.onListItemsBegin();
		this._listHasChildStack.push(false);
	},
	onOrderedListBlockBegin: function (startIndex) {
		this._onBlockBegin(BlockType.TYPE_ORDERED_LIST);
		this._markdomHandler.onOrderedListBlockBegin(startIndex);
		this._markdomHandler.onListItemsBegin();
		this._orderedListStartIndexStack.push(startIndex);
		this._listHasChildStack.push(false);
	},
	onListItemBegin: function () {
		if (this._listHasChildStack.get() === true) {
			this._markdomHandler.onNextListItem();
		}
		this._markdomHandler.onListItemBegin();
		this._onBlocksBegin();
		this._listHasChildStack.set(true);
	},
	onListItemEnd: function () {
		this._onBlocksEnd();
		this._markdomHandler.onListItemEnd();
	},
	onUnorderedListBlockEnd: function () {
		this._listHasChildStack.pop();
		this._markdomHandler.onListItemsEnd();
		this._markdomHandler.onUnorderedListBlockEnd();
		this._onBlockEnd(BlockType.TYPE_UNORDERED_LIST);
	},
	onOrderedListBlockEnd: function () {
		this._listHasChildStack.pop();
		this._markdomHandler.onListItemsEnd();
		this._markdomHandler.onOrderedListBlockEnd(this._orderedListStartIndexStack.pop());
		this._onBlockEnd(BlockType.TYPE_ORDERED_LIST);
	},
	onParagraphBlockBegin: function () {
		this._onBlockBegin(BlockType.TYPE_PARAGRAPH);
		this._markdomHandler.onParagraphBlockBegin();
		this._onContentsBegin();
	},
	onParagraphBlockEnd: function () {
		this._onContentsEnd();
		this._markdomHandler.onParagraphBlockEnd();
		this._onBlockEnd(BlockType.TYPE_PARAGRAPH);
	},
	onQuoteBlockBegin: function () {
		this._onBlockBegin(BlockType.TYPE_QUOTE);
		this._markdomHandler.onQuoteBlockBegin();
		this._onBlocksBegin();
	},
	onQuoteBlockEnd: function () {
		this._onBlocksEnd();
		this._markdomHandler.onQuoteBlockEnd();
		this._onBlockEnd(BlockType.TYPE_QUOTE);
	},
	onCodeContent: function (code) {
		this._onContentBegin(ContentType.TYPE_CODE);
		this._markdomHandler.onCodeContent(code);
		this._onContentEnd(ContentType.TYPE_CODE);
	},
	onEmphasisContentBegin: function (level) {
		this._onContentBegin(ContentType.TYPE_EMPHASIS);
		this._markdomHandler.onEmphasisContentBegin(level);
		this._onContentsBegin();
		this._emphasisLevelStack.push(level);
	},
	onEmphasisContentEnd: function () {
		this._onContentsEnd();
		this._markdomHandler.onEmphasisContentEnd(this._emphasisLevelStack.pop());
		this._onContentEnd(ContentType.TYPE_EMPHASIS);
	},
	onImageContent: function (uri, title, alternative) {
		this._onContentBegin(ContentType.TYPE_IMAGE);
		this._markdomHandler.onImageContent(uri, title, alternative);
		this._onContentEnd(ContentType.TYPE_IMAGE);
	},
	onLineBreakContent: function (hard) {
		this._onContentBegin(ContentType.TYPE_LINE_BREAK);
		this._markdomHandler.onLineBreakContent(hard);
		this._onContentEnd(ContentType.TYPE_LINE_BREAK);
	},
	onLinkContentBegin: function (uri, title) {
		this._onContentBegin(ContentType.TYPE_LINK);
		this._markdomHandler.onLinkContentBegin(uri, title);
		this._onContentsBegin();
		this._linkUriStack.push(uri);
		this._linkTitleStack.push(title);
	},
	onLinkContentEnd: function () {
		this._onContentsEnd();
		this._markdomHandler.onLinkContentEnd(this._linkUriStack.pop(), this._linkTitleStack.pop());
		this._onContentEnd(ContentType.TYPE_LINK);
	},
	onTextContent: function (text) {
		this._onContentBegin(ContentType.TYPE_TEXT);
		this._markdomHandler.onTextContent(text);
		this._onContentEnd(ContentType.TYPE_TEXT);
	},
	_onBlocksBegin: function () {
		this._markdomHandler.onBlocksBegin();
		this._blocksHasChildStack.push(false);
	},
	_onBlocksEnd: function () {
		this._blocksHasChildStack.pop();
		this._markdomHandler.onBlocksEnd();
	},
	_onBlockBegin: function (type) {
		if (this._blocksHasChildStack.get() === true) {
			this._markdomHandler.onNextBlock();
		}
		this._markdomHandler.onBlockBegin(type);
		this._blocksHasChildStack.set(true);
	},
	_onBlockEnd: function (type) {
		this._markdomHandler.onBlockEnd(type);
	},
	_onContentsBegin: function () {
		this._markdomHandler.onContentsBegin();
		this._contentsHasChildStack.push(false);
	},
	_onContentsEnd: function () {
		this._contentsHasChildStack.pop();
		this._markdomHandler.onContentsEnd();
	},
	_onContentBegin: function (type) {
		if (this._contentsHasChildStack.get() === true) {
			this._markdomHandler.onNextContent();
		}
		this._markdomHandler.onContentBegin(type);
		this._contentsHasChildStack.set(true);
	},
	_onContentEnd: function (type) {
		this._markdomHandler.onContentEnd(type);
	}
});

var JsonDispatcher = BindedJsClass.extend({
	_document: null,
	_eventDispatcher: null,
	_video: null,
	_controls: null,
	_startButton: null,
	_playButton: null,
	_muteButton: null,
	_controlTimecodeElapsed: null,
	_controlTimecodeRemaining: null,
	_controlBars: null,
	_controlBarBackground: null,
	_controlBarBuffer: null,
	_controlBarProgress: null,
	_volumeBars: null,
	_volumeBarBackground: null,
	_volumeBarVolume: null,
	_fullscreenButton: null,
	_fullscreenEnabled: null,
	_hideControlsTimeout: 3000,
	_hideControlsTimeoutId: 0,
	_videoStatus: 'STOPPED',
	construct: function (jsonString) {
		this._document = JSON.parse(jsonString);
	},
	dispatchTo: function (markdomHandler) {
		// Init event dispatcher
		this._eventDispatcher = new SimpleMarkdomEventDispatcher(markdomHandler);
		// Walk through the document
		if (typeof this._document !== 'object') {
			throw new DispatcherException('Markdom invalid: root node is no object.');
		}
		if (!this._document.hasOwnProperty('version') || typeof this._document.version !== 'object') {
			throw new DispatcherException('Markdom invalid: no document version specified.');
		}
		if (!this._document.version.hasOwnProperty('major') || !this._document.version.hasOwnProperty('minor')) {
			throw new DispatcherException('Markdom invalid: no document valid version specified.');
		}
		//noinspection JSUnresolvedVariable
		if (parseInt(this._document.version.major, 10) !== 1 || parseInt(this._document.version.minor, 10) !== 0) {
			throw new DispatcherException('Markdom invalid: version mismatch Expected version 1.0.');
		}
		this._eventDispatcher.onDocumentBegin();
		//noinspection JSUnresolvedVariable
		this._processBlocks(this._document.blocks);
		this._eventDispatcher.onDocumentEnd();
		return markdomHandler.getResult();
	},
	_processBlocks: function (blocks) {
		for (var i = 0; i < blocks.length; i++) {
			var node = blocks[i];
			if (typeof node !== 'object') {
				throw new DispatcherException('Markdom invalid: block node is no object.');
			}
			if (!node.hasOwnProperty('type')) {
				throw new DispatcherException('Markdom invalid: block node has no type.');
			}
			switch (node.type) {
				case KeyNameTranslator.TYPE_CODE:
					//noinspection JSUnresolvedVariable
					var hint = node.hasOwnProperty('hint') ? node.hint : null;
					this._eventDispatcher.onCodeBlock(node.code, hint);
					break;
				case KeyNameTranslator.TYPE_COMMENT:
					//noinspection JSUnresolvedVariable
					this._eventDispatcher.onCommentBlock(node.comment);
					break;
				case KeyNameTranslator.TYPE_DIVISION:
					this._eventDispatcher.onDivisionBlock();
					break;
				case KeyNameTranslator.TYPE_HEADING:
					//noinspection JSUnresolvedVariable
					this._eventDispatcher.onHeadingBlockBegin(node.level);
					//noinspection JSUnresolvedVariable
					this._processContents(node.contents);
					this._eventDispatcher.onHeadingBlockEnd();
					break;
				case KeyNameTranslator.TYPE_UNORDERED_LIST:
					this._eventDispatcher.onUnorderedListBlockBegin();
					this._processListItems(node.items);
					this._eventDispatcher.onUnorderedListBlockEnd();
					break;
				case KeyNameTranslator.TYPE_ORDERED_LIST:
					//noinspection JSUnresolvedVariable
					this._eventDispatcher.onOrderedListBlockBegin(node.startIndex);
					this._processListItems(node.items);
					this._eventDispatcher.onOrderedListBlockEnd();
					break;
				case KeyNameTranslator.TYPE_PARAGRAPH:
					this._eventDispatcher.onParagraphBlockBegin();
					//noinspection JSUnresolvedVariable
					this._processContents(node.contents);
					this._eventDispatcher.onParagraphBlockEnd();
					break;
				case KeyNameTranslator.TYPE_QUOTE:
					this._eventDispatcher.onQuoteBlockBegin();
					//noinspection JSUnresolvedVariable
					this._processBlocks(node.blocks);
					this._eventDispatcher.onQuoteBlockEnd();
					break;
				default:
					throw new DispatcherException('Markdom invalid: block node type ' + node.type + ' is invalid.');
					break;
			}
		}
		return this;
	},
	_processListItems: function (listItems) {
		for (var i = 0; i < listItems.length; i++) {
			var node = listItems[i];
			if (typeof node !== 'object') {
				throw new DispatcherException('Markdom invalid: list item node is no object.');
			}
			this._eventDispatcher.onListItemBegin();
			//noinspection JSUnresolvedVariable
			this._processBlocks(node.blocks);
			this._eventDispatcher.onListItemEnd();
		}
		return this;
	},
	_processContents: function (contents) {
		for (var i = 0; i < contents.length; i++) {
			var node = contents[i];
			if (typeof node !== 'object') {
				throw new DispatcherException('Markdom invalid: content node is no object.');
			}
			if (!node.hasOwnProperty('type')) {
				throw new DispatcherException('Markdom invalid: content node has no type.');
			}
			switch (node.type) {
				case KeyNameTranslator.TYPE_CODE:
					this._eventDispatcher.onCodeContent(node.code);
					break;
				case KeyNameTranslator.TYPE_EMPHASIS:
					//noinspection JSUnresolvedVariable
					this._eventDispatcher.onEmphasisContentBegin(node.level);
					//noinspection JSUnresolvedVariable
					this._processContents(node.contents);
					this._eventDispatcher.onEmphasisContentEnd();
					break;
				case KeyNameTranslator.TYPE_IMAGE:
					var imageTitle = node.hasOwnProperty('title') ? node.title : null;
					//noinspection JSUnresolvedVariable
					var alternative = node.hasOwnProperty('alternative') ? node.alternative : null;
					this._eventDispatcher.onImageContent(node.uri, imageTitle, alternative);
					break;
				case KeyNameTranslator.TYPE_LINE_BREAK:
					//noinspection JSUnresolvedVariable
					this._eventDispatcher.onLineBreakContent(node.hard);
					break;
				case KeyNameTranslator.TYPE_LINK:
					var linkTitle = node.hasOwnProperty('title') ? node.title : null;
					this._eventDispatcher.onLinkContentBegin(node.uri, linkTitle);
					//noinspection JSUnresolvedVariable
					this._processContents(node.contents);
					this._eventDispatcher.onLinkContentEnd();
					break;
				case KeyNameTranslator.TYPE_TEXT:
					this._eventDispatcher.onTextContent(node.text);
					break;
				default:
					throw new DispatcherException('Markdom invalid: content node type ' + node.type + ' is invalid.');
					break;
			}
		}
		return this;
	}
});
