/*
 * Copyright (c) 2017. Martin Brecht-Precht, Markenwerk GmbH
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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
};

DispatcherException.prototype.toString = function () {
	return this.name + ': ' + this.message;
};

var JsonDispatcher = function (jsonString) {
	this._eventDispatcher = null;
	this._document = JSON.parse(jsonString);
};

JsonDispatcher.prototype.dispatchTo = function (markdomHandler) {
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
};

JsonDispatcher.prototype._processBlocks = function (blocks) {
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
};

JsonDispatcher.prototype._processListItems = function (listItems) {
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
};

JsonDispatcher.prototype._processContents = function (contents) {
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
};
