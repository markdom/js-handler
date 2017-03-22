var HandlerException = function (message) {
	this.message = message;
	this.name = "HandlerException";
	this.toString = function () {
		return this.name + ': ' + this.message;
	};
};

var HeadingLevel = {
	LEVEL_1: 1,
	LEVEL_2: 2,
	LEVEL_3: 3,
	LEVEL_4: 4,
	LEVEL_5: 5,
	LEVEL_6: 6
};

var EmphasisLevel = {
	LEVEL_1: 1,
	LEVEL_2: 2
};

var TagBuilder = BindedJsClass.extend({
	TYPE_CODE_BLOCK: 'CODE_BLOCK',
	TYPE_CODE_INLINE: 'CODE_INLINE',
	TYPE_COMMENT: 'COMMENT',
	TYPE_DIVISION: 'DIVISION',
	TYPE_HEADING_BEGIN: 'HEADING_BEGIN',
	TYPE_HEADING_END: 'HEADING_END',
	TYPE_UNORDERED_LIST_BEGIN: 'UNORDERED_LIST_BEGIN',
	TYPE_UNORDERED_LIST_END: 'UNORDERED_LIST_END',
	TYPE_ORDERED_LIST_BEGIN: 'ORDERED_LIST_BEGIN',
	TYPE_ORDERED_LIST_END: 'ORDERED_LIST_END',
	TYPE_LIST_ITEM_BEGIN: 'LIST_ITEM_BEGIN',
	TYPE_LIST_ITEM_END: 'LIST_ITEM_END',
	TYPE_PARAGRAPH_BEGIN: 'PARAGRAPH_BEGIN',
	TYPE_PARAGRAPH_END: 'PARAGRAPH_END',
	TYPE_QUOTE_BEGIN: 'QUOTE_BEGIN',
	TYPE_QUOTE_END: 'QUOTE_END',
	TYPE_EMPHASIS_LEVEL_1_BEGIN: 'EMPHASIS_LEVEL_1_BEGIN',
	TYPE_EMPHASIS_LEVEL_1_END: 'EMPHASIS_LEVEL_1_END',
	TYPE_EMPHASIS_LEVEL_2_BEGIN: 'EMPHASIS_LEVEL_2_BEGIN',
	TYPE_EMPHASIS_LEVEL_2_END: 'EMPHASIS_LEVEL_2_END',
	TYPE_IMAGE: 'IMAGE',
	TYPE_LINE_BREAK: 'LINE_BREAK',
	TYPE_LINK_BEGIN: 'LINK_BEGIN',
	TYPE_LINK_END: 'LINK_END',
	buildTag: function (type, value, attributes, variant) {
		switch (type) {
			case this.TYPE_CODE_BLOCK:
				return '<pre><code' + this._getAttributeString(attributes) + '>' + value + '</code></pre>';
			case this.TYPE_CODE_INLINE:
				return '<code' + this._getAttributeString(attributes) + '>' + value + '</code>';
			case this.TYPE_COMMENT:
				return '<!-- ' + value + ' -->';
			case this.TYPE_DIVISION:
				return '<hr' + this._getAttributeString(attributes) + '>';
			case this.TYPE_HEADING_BEGIN:
				switch (variant) {
					case HeadingLevel.LEVEL_2:
						return '<h2' + this._getAttributeString(attributes) + '>';
					case HeadingLevel.LEVEL_3:
						return '<h3' + this._getAttributeString(attributes) + '>';
					case HeadingLevel.LEVEL_4:
						return '<h4' + this._getAttributeString(attributes) + '>';
					case HeadingLevel.LEVEL_5:
						return '<h5' + this._getAttributeString(attributes) + '>';
					case HeadingLevel.LEVEL_6:
						return '<h6' + this._getAttributeString(attributes) + '>';
					case HeadingLevel.LEVEL_1:
					default:
						return '<h1' + this._getAttributeString(attributes) + '>';
				}
			case this.TYPE_HEADING_END:
				switch (variant) {
					case HeadingLevel.LEVEL_2:
						return '</h2>';
					case HeadingLevel.LEVEL_3:
						return '</h3>';
					case HeadingLevel.LEVEL_4:
						return '</h4>';
					case HeadingLevel.LEVEL_5:
						return '</h5>';
					case HeadingLevel.LEVEL_6:
						return '</h6>';
					case HeadingLevel.LEVEL_1:
					default:
						return '</h1>';
				}
			case this.TYPE_UNORDERED_LIST_BEGIN:
				return '<ul' + this._getAttributeString(attributes) + '>';
			case this.TYPE_UNORDERED_LIST_END:
				return '</ul>';
			case this.TYPE_ORDERED_LIST_BEGIN:
				return '<ol' + this._getAttributeString(attributes) + '>';
			case this.TYPE_ORDERED_LIST_END:
				return '</ol>';
			case this.TYPE_LIST_ITEM_BEGIN:
				return '<li' + this._getAttributeString(attributes) + '>';
			case this.TYPE_LIST_ITEM_END:
				return '</li>';
			case this.TYPE_PARAGRAPH_BEGIN:
				return '<p' + this._getAttributeString(attributes) + '>';
			case this.TYPE_PARAGRAPH_END:
				return '</p>';
			case this.TYPE_QUOTE_BEGIN:
				return '<blockquote' + this._getAttributeString(attributes) + '>';
			case this.TYPE_QUOTE_END:
				return '</blockquote>';
			case this.TYPE_EMPHASIS_LEVEL_1_BEGIN:
				return '<em' + this._getAttributeString(attributes) + '>';
			case this.TYPE_EMPHASIS_LEVEL_1_END:
				return '</em>';
			case this.TYPE_EMPHASIS_LEVEL_2_BEGIN:
				return '<strong' + this._getAttributeString(attributes) + '>';
			case this.TYPE_EMPHASIS_LEVEL_2_END:
				return '</strong>';
			case this.TYPE_IMAGE:
				return '<img' + this._getAttributeString(attributes) + '>';
			case this.TYPE_LINE_BREAK:
				return '<br>';
			case this.TYPE_LINK_BEGIN:
				return '<a' + this._getAttributeString(attributes) + '>';
			case this.TYPE_LINK_END:
				return '</a>';
		}
		throw new HandlerException('Invalid tagname type ' + type);
	},
	_getAttributeString: function (attributes) {
		var attributeParts = [];
		for (var key in attributes) {
			var value = attributes.key;
			if (value === null) {
				continue;
			}
			value = value.replace(/^\s+|\s+$/g, '');
			if (value.length === 0) {
				continue;
			}
			attributeParts.push(key.toString().toLowerCase() + '="' + value + '"');
		}
		if (attributeParts.length === 0) {
			return '';
		}
		return ' ' + attributeParts.join(' ');
	}
});

var HtmlHandler = BindedJsClass.extend({
	LINE_BREAK: "\n",
	_handleComments: true,
	_tagBuilder: null,
	_escapeHtml: false,
	_breakSoftBreaks: false,
	_htmlBuilder: null,
	_blockStack: null,
	construct: function () {
		this._tagBuilder = new TagBuilder();
		this._htmlBuilder = new StringBuilder();
		this._blockStack = new Stack();
	},
	getHandleComments: function () {
		return this._handleComments;
	},
	setHandleComments: function (handleComments) {
		this._handleComments = handleComments;
		return this;
	},
	getTagBuilder: function () {
		return this._tagBuilder;
	},
	setTagBuilder: function (tagBuilder) {
		this._tagBuilder = tagBuilder;
		return this;
	},
	getEscapeHtml: function () {
		return this._escapeHtml;
	},
	setEscapeHtml: function (escapeHtml) {
		this._escapeHtml = escapeHtml;
		return this;
	},
	getBreakSoftBreaks: function () {
		return this._breakSoftBreaks;
	},
	setBreakSoftBreaks: function (breakSoftBreaks) {
		this._breakSoftBreaks = breakSoftBreaks;
		return this;
	},
	getHtmlBuilder: function () {
		return this._htmlBuilder;
	},
	getBlockStack: function () {
		return this._blockStack;
	},
	onDocumentBegin: function () {
	},
	onDocumentEnd: function () {
	},
	onBlocksBegin: function () {
	},
	onBlockBegin: function (type) {
		if (this._htmlBuilder.size() > 0) {
			this._htmlBuilder.append(this.LINE_BREAK);
		}
		this._blockStack.push(type);
	},
	onCodeBlock: function (code, hint) {
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				TagBuilder.TYPE_CODE_BLOCK,
				code,
				{class: hint}
			)
		);
	},
	onCommentBlock: function (comment) {
		if (!this.getHandleComments()) {
			return;
		}
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				TagBuilder.TYPE_COMMENT,
				comment
			)
		);
	},
	onDivisionBlock: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_DIVISION), null);
	},
	onHeadingBlockBegin: function (level) {
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				TagBuilder.TYPE_HEADING_BEGIN,
				null,
				{},
				level
			)
		);
	},
	onHeadingBlockEnd: function (level) {
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				TagBuilder.TYPE_HEADING_END,
				null,
				{},
				level
			)
		);
	},
	onUnorderedListBlockBegin: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_UNORDERED_LIST_BEGIN), null);
	},
	onOrderedListBlockBegin: function (startIndex) {
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				TagBuilder.TYPE_ORDERED_LIST_BEGIN,
				null,
				{start: startIndex.toString()}
			)
		);
	},
	onListItemsBegin: function () {
	},
	onListItemBegin: function () {
		this._htmlBuilder
			.append(this.LINE_BREAK)
			.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_LIST_ITEM_BEGIN), null);
		this._blockStack.push('listitem');
	},
	onListItemEnd: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_LIST_ITEM_END), null);
		this._blockStack.pop();
	},
	onNextListItem: function () {
	},
	onListItemsEnd: function () {
		if (this._blockStack.size() > 0) {
			this._htmlBuilder.append(this.LINE_BREAK, null);
		}
	},
	onUnorderedListBlockEnd: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_UNORDERED_LIST_END), null);
	},
	onOrderedListBlockEnd: function (startIndex) {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_ORDERED_LIST_END), null);
	},
	onParagraphBlockBegin: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_PARAGRAPH_BEGIN), null);
	},
	onParagraphBlockEnd: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_PARAGRAPH_END), null);
	},
	onQuoteBlockBegin: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_QUOTE_BEGIN), null);
	},
	onQuoteBlockEnd: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_QUOTE_END), null);
	},
	onBlockEnd: function (type) {
	},
	onNextBlock: function () {
	},
	onBlocksEnd: function () {
		if (this._blockStack.size() > 0) {
			this._htmlBuilder.append(this.LINE_BREAK);
		}
	},
	onContentsBegin: function () {
	},
	onContentBegin: function (type) {
	},
	onCodeContent: function (code) {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_CODE_INLINE, code), null);
	},
	onEmphasisContentBegin: function (level) {
		var tagType = TagBuilder.TYPE_EMPHASIS_LEVEL_1_BEGIN;
		if (level == EmphasisLevel.LEVEL_2) {
			tagType = TagBuilder.TYPE_EMPHASIS_LEVEL_2_BEGIN;
		}
		this._htmlBuilder.append(this.getTagBuilder().buildTag(tagType), null);
	},
	onEmphasisContentEnd: function (level) {
		var tagType = TagBuilder.TYPE_EMPHASIS_LEVEL_1_END;
		if (level == EmphasisLevel.LEVEL_2) {
			tagType = TagBuilder.TYPE_EMPHASIS_LEVEL_2_END;
		}
		this._htmlBuilder.append(this.getTagBuilder().buildTag(tagType), null);
	},
	onImageContent: function (uri, title, alternative) {
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				TagBuilder.TYPE_IMAGE,
				null,
				{
					src: uri,
					title: title,
					alt: alternative
				}
			)
		);
	},
	onLineBreakContent: function (hard) {
		if (hard || this.getBreakSoftBreaks()) {
			this._htmlBuilder.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_LINE_BREAK), null);
		} else {
			this._htmlBuilder.append(this.LINE_BREAK, null);
		}
	},
	onLinkContentBegin: function (uri, title) {
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				TagBuilder.TYPE_LINK_BEGIN,
				null,
				{
					href: uri,
					title: title
				}
			)
		);
	},
	onLinkContentEnd: function (uri, title) {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(TagBuilder.TYPE_LINK_END), null);
	},
	onTextContent: function (text) {
		if (this.getEscapeHtml()) {
			text = this._htmlEscape(text);
		}
		this._htmlBuilder.append(text);
	},
	onContentEnd: function (type) {
	},
	onNextContent: function () {
	},
	onContentsEnd: function () {
	},
	getResult: function () {
		return this._htmlBuilder.build();
	},
	_htmlEscape: function (unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
});
