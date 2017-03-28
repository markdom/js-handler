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

var SimpleMarkdomEventDispatcher = function (markdomHandler) {
	this._markdomHandler = markdomHandler;
	this._blocksHasChildStack = [];
	this._listHasChildStack = [];
	this._contentsHasChildStack = [];
	this._headingLevelStack = [];
	this._orderedListStartIndexStack = [];
	this._emphasisLevelStack = [];
	this._linkUriStack = [];
	this._linkTitleStack = [];
};

SimpleMarkdomEventDispatcher.prototype.onDocumentBegin = function () {
	this._markdomHandler.onDocumentBegin();
	this._onBlocksBegin();
};

SimpleMarkdomEventDispatcher.prototype.onDocumentEnd = function () {
	this._onBlocksEnd();
	this._markdomHandler.onDocumentEnd();
};

SimpleMarkdomEventDispatcher.prototype.onCodeBlock = function (code, hint) {
	this._onBlockBegin(BlockType.TYPE_CODE);
	this._markdomHandler.onCodeBlock(code, hint);
	this._onBlockEnd(BlockType.TYPE_CODE);
};

SimpleMarkdomEventDispatcher.prototype.onCommentBlock = function (comment) {
	this._onBlockBegin(BlockType.TYPE_COMMENT);
	this._markdomHandler.onCommentBlock(comment);
	this._onBlockEnd(BlockType.TYPE_COMMENT);
};

SimpleMarkdomEventDispatcher.prototype.onDivisionBlock = function () {
	this._onBlockBegin(BlockType.TYPE_DIVISION);
	this._markdomHandler.onDivisionBlock();
	this._onBlockEnd(BlockType.TYPE_DIVISION);
};

SimpleMarkdomEventDispatcher.prototype.onHeadingBlockBegin = function (level) {
	this._onBlockBegin(BlockType.TYPE_HEADING);
	this._markdomHandler.onHeadingBlockBegin(level);
	this._onContentsBegin();
	this._headingLevelStack.push(level);
};

SimpleMarkdomEventDispatcher.prototype.onHeadingBlockEnd = function () {
	this._onContentsEnd();
	this._markdomHandler.onHeadingBlockEnd(this._headingLevelStack.pop());
	this._onBlockEnd(BlockType.TYPE_HEADING);
};

SimpleMarkdomEventDispatcher.prototype.onUnorderedListBlockBegin = function () {
	this._onBlockBegin(BlockType.TYPE_UNORDERED_LIST);
	this._markdomHandler.onUnorderedListBlockBegin();
	this._markdomHandler.onListItemsBegin();
	this._listHasChildStack.push(false);
};

SimpleMarkdomEventDispatcher.prototype.onOrderedListBlockBegin = function (startIndex) {
	this._onBlockBegin(BlockType.TYPE_ORDERED_LIST);
	this._markdomHandler.onOrderedListBlockBegin(startIndex);
	this._markdomHandler.onListItemsBegin();
	this._orderedListStartIndexStack.push(startIndex);
	this._listHasChildStack.push(false);
};

SimpleMarkdomEventDispatcher.prototype.onListItemBegin = function () {
	if (this._listHasChildStack[this._listHasChildStack.length - 1] === true) {
		this._markdomHandler.onNextListItem();
	}
	this._markdomHandler.onListItemBegin();
	this._onBlocksBegin();
	this._listHasChildStack[this._listHasChildStack.length - 1] = true;
};

SimpleMarkdomEventDispatcher.prototype.onListItemEnd = function () {
	this._onBlocksEnd();
	this._markdomHandler.onListItemEnd();
};

SimpleMarkdomEventDispatcher.prototype.onUnorderedListBlockEnd = function () {
	this._listHasChildStack.pop();
	this._markdomHandler.onListItemsEnd();
	this._markdomHandler.onUnorderedListBlockEnd();
	this._onBlockEnd(BlockType.TYPE_UNORDERED_LIST);
};

SimpleMarkdomEventDispatcher.prototype.onOrderedListBlockEnd = function () {
	this._listHasChildStack.pop();
	this._markdomHandler.onListItemsEnd();
	this._markdomHandler.onOrderedListBlockEnd(this._orderedListStartIndexStack.pop());
	this._onBlockEnd(BlockType.TYPE_ORDERED_LIST);
};

SimpleMarkdomEventDispatcher.prototype.onParagraphBlockBegin = function () {
	this._onBlockBegin(BlockType.TYPE_PARAGRAPH);
	this._markdomHandler.onParagraphBlockBegin();
	this._onContentsBegin();
};

SimpleMarkdomEventDispatcher.prototype.onParagraphBlockEnd = function () {
	this._onContentsEnd();
	this._markdomHandler.onParagraphBlockEnd();
	this._onBlockEnd(BlockType.TYPE_PARAGRAPH);
};

SimpleMarkdomEventDispatcher.prototype.onQuoteBlockBegin = function () {
	this._onBlockBegin(BlockType.TYPE_QUOTE);
	this._markdomHandler.onQuoteBlockBegin();
	this._onBlocksBegin();
};

SimpleMarkdomEventDispatcher.prototype.onQuoteBlockEnd = function () {
	this._onBlocksEnd();
	this._markdomHandler.onQuoteBlockEnd();
	this._onBlockEnd(BlockType.TYPE_QUOTE);
};

SimpleMarkdomEventDispatcher.prototype.onCodeContent = function (code) {
	this._onContentBegin(ContentType.TYPE_CODE);
	this._markdomHandler.onCodeContent(code);
	this._onContentEnd(ContentType.TYPE_CODE);
};

SimpleMarkdomEventDispatcher.prototype.onEmphasisContentBegin = function (level) {
	this._onContentBegin(ContentType.TYPE_EMPHASIS);
	this._markdomHandler.onEmphasisContentBegin(level);
	this._onContentsBegin();
	this._emphasisLevelStack.push(level);
};

SimpleMarkdomEventDispatcher.prototype.onEmphasisContentEnd = function () {
	this._onContentsEnd();
	this._markdomHandler.onEmphasisContentEnd(this._emphasisLevelStack.pop());
	this._onContentEnd(ContentType.TYPE_EMPHASIS);
};

SimpleMarkdomEventDispatcher.prototype.onImageContent = function (uri, title, alternative) {
	this._onContentBegin(ContentType.TYPE_IMAGE);
	this._markdomHandler.onImageContent(uri, title, alternative);
	this._onContentEnd(ContentType.TYPE_IMAGE);
};

SimpleMarkdomEventDispatcher.prototype.onLineBreakContent = function (hard) {
	this._onContentBegin(ContentType.TYPE_LINE_BREAK);
	this._markdomHandler.onLineBreakContent(hard);
	this._onContentEnd(ContentType.TYPE_LINE_BREAK);
};

SimpleMarkdomEventDispatcher.prototype.onLinkContentBegin = function (uri, title) {
	this._onContentBegin(ContentType.TYPE_LINK);
	this._markdomHandler.onLinkContentBegin(uri, title);
	this._onContentsBegin();
	this._linkUriStack.push(uri);
	this._linkTitleStack.push(title);
};

SimpleMarkdomEventDispatcher.prototype.onLinkContentEnd = function () {
	this._onContentsEnd();
	this._markdomHandler.onLinkContentEnd(this._linkUriStack.pop(), this._linkTitleStack.pop());
	this._onContentEnd(ContentType.TYPE_LINK);
};

SimpleMarkdomEventDispatcher.prototype.onTextContent = function (text) {
	this._onContentBegin(ContentType.TYPE_TEXT);
	this._markdomHandler.onTextContent(text);
	this._onContentEnd(ContentType.TYPE_TEXT);
};

SimpleMarkdomEventDispatcher.prototype._onBlocksBegin = function () {
	this._markdomHandler.onBlocksBegin();
	this._blocksHasChildStack.push(false);
};

SimpleMarkdomEventDispatcher.prototype._onBlocksEnd = function () {
	this._blocksHasChildStack.pop();
	this._markdomHandler.onBlocksEnd();
};

SimpleMarkdomEventDispatcher.prototype._onBlockBegin = function (type) {
	if (this._blocksHasChildStack[this._blocksHasChildStack.length - 1] === true) {
		this._markdomHandler.onNextBlock();
	}
	this._markdomHandler.onBlockBegin(type);
	this._blocksHasChildStack[this._blocksHasChildStack.length - 1] = true;
};

SimpleMarkdomEventDispatcher.prototype._onBlockEnd = function (type) {
	this._markdomHandler.onBlockEnd(type);
};

SimpleMarkdomEventDispatcher.prototype._onContentsBegin = function () {
	this._markdomHandler.onContentsBegin();
	this._contentsHasChildStack.push(false);
};

SimpleMarkdomEventDispatcher.prototype._onContentsEnd = function () {
	this._contentsHasChildStack.pop();
	this._markdomHandler.onContentsEnd();
};

SimpleMarkdomEventDispatcher.prototype._onContentBegin = function (type) {
	if (this._contentsHasChildStack[this._contentsHasChildStack.length - 1] === true) {
		this._markdomHandler.onNextContent();
	}
	this._markdomHandler.onContentBegin(type);
	this._contentsHasChildStack[this._contentsHasChildStack.length - 1] = true;
};

SimpleMarkdomEventDispatcher.prototype._onContentEnd = function (type) {
	this._markdomHandler.onContentEnd(type);
};
