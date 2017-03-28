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

var HtmlTagBuilderTypes = {
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
	HEADING_LEVEL_1: 1,
	HEADING_LEVEL_2: 2,
	HEADING_LEVEL_3: 3,
	HEADING_LEVEL_4: 4,
	HEADING_LEVEL_5: 5,
	HEADING_LEVEL_6: 6
};

var HtmlTagBuilder = function() {
	this._type = this.BUILD_TYPE_HTML;
};

HtmlTagBuilder.prototype.BUILD_TYPE_HTML = 'HTML';
HtmlTagBuilder.prototype.BUILD_TYPE_XHTML = 'XHTML';

//noinspection JSUnusedGlobalSymbols
HtmlTagBuilder.prototype.setType = function (buildType) {
	this._type = buildType;
	return this;
};

//noinspection JSUnusedGlobalSymbols
HtmlTagBuilder.prototype.getType = function () {
	return this._type;
};

HtmlTagBuilder.prototype.isXhtml = function () {
	return this._type === this.BUILD_TYPE_XHTML;
};

HtmlTagBuilder.prototype.buildTag = function (type, value, attributes, variant) {
	switch (type) {
		case HtmlTagBuilderTypes.TYPE_CODE_BLOCK:
			return '<pre><code' + this._getAttributeString(attributes) + '>' + value + '</code></pre>';
		case HtmlTagBuilderTypes.TYPE_CODE_INLINE:
			return '<code' + this._getAttributeString(attributes) + '>' + value + '</code>';
		case HtmlTagBuilderTypes.TYPE_COMMENT:
			return '<!-- ' + value + ' -->';
		case HtmlTagBuilderTypes.TYPE_DIVISION:
			var hrTag = '<hr' + this._getAttributeString(attributes);
			if (this.isXhtml()) {
				return hrTag + ' />';
			}
			return hrTag + '>';
		case HtmlTagBuilderTypes.TYPE_HEADING_BEGIN:
			switch (variant) {
				case HtmlTagBuilderTypes.HEADING_LEVEL_1:
					return '<h1' + this._getAttributeString(attributes) + '>';
				case HtmlTagBuilderTypes.HEADING_LEVEL_2:
					return '<h2' + this._getAttributeString(attributes) + '>';
				case HtmlTagBuilderTypes.HEADING_LEVEL_3:
					return '<h3' + this._getAttributeString(attributes) + '>';
				case HtmlTagBuilderTypes.HEADING_LEVEL_4:
					return '<h4' + this._getAttributeString(attributes) + '>';
				case HtmlTagBuilderTypes.HEADING_LEVEL_5:
					return '<h5' + this._getAttributeString(attributes) + '>';
				case HtmlTagBuilderTypes.HEADING_LEVEL_6:
					return '<h6' + this._getAttributeString(attributes) + '>';
				default:
					throw new HandlerException('Invalid heading level ' + level);
			}
		case HtmlTagBuilderTypes.TYPE_HEADING_END:
			switch (variant) {
				case HtmlTagBuilderTypes.HEADING_LEVEL_1:
					return '</h2>';
				case HtmlTagBuilderTypes.HEADING_LEVEL_2:
					return '</h2>';
				case HtmlTagBuilderTypes.HEADING_LEVEL_3:
					return '</h3>';
				case HtmlTagBuilderTypes.HEADING_LEVEL_4:
					return '</h4>';
				case HtmlTagBuilderTypes.HEADING_LEVEL_5:
					return '</h5>';
				case HtmlTagBuilderTypes.HEADING_LEVEL_6:
					return '</h6>';
				default:
					throw new HandlerException('Invalid heading level ' + level);
			}
		case HtmlTagBuilderTypes.TYPE_UNORDERED_LIST_BEGIN:
			return '<ul' + this._getAttributeString(attributes) + '>';
		case HtmlTagBuilderTypes.TYPE_UNORDERED_LIST_END:
			return '</ul>';
		case HtmlTagBuilderTypes.TYPE_ORDERED_LIST_BEGIN:
			return '<ol' + this._getAttributeString(attributes) + '>';
		case HtmlTagBuilderTypes.TYPE_ORDERED_LIST_END:
			return '</ol>';
		case HtmlTagBuilderTypes.TYPE_LIST_ITEM_BEGIN:
			return '<li' + this._getAttributeString(attributes) + '>';
		case HtmlTagBuilderTypes.TYPE_LIST_ITEM_END:
			return '</li>';
		case HtmlTagBuilderTypes.TYPE_PARAGRAPH_BEGIN:
			return '<p' + this._getAttributeString(attributes) + '>';
		case HtmlTagBuilderTypes.TYPE_PARAGRAPH_END:
			return '</p>';
		case HtmlTagBuilderTypes.TYPE_QUOTE_BEGIN:
			return '<blockquote' + this._getAttributeString(attributes) + '>';
		case HtmlTagBuilderTypes.TYPE_QUOTE_END:
			return '</blockquote>';
		case HtmlTagBuilderTypes.TYPE_EMPHASIS_LEVEL_1_BEGIN:
			return '<em' + this._getAttributeString(attributes) + '>';
		case HtmlTagBuilderTypes.TYPE_EMPHASIS_LEVEL_1_END:
			return '</em>';
		case HtmlTagBuilderTypes.TYPE_EMPHASIS_LEVEL_2_BEGIN:
			return '<strong' + this._getAttributeString(attributes) + '>';
		case HtmlTagBuilderTypes.TYPE_EMPHASIS_LEVEL_2_END:
			return '</strong>';
		case HtmlTagBuilderTypes.TYPE_IMAGE:
			var imgTag = '<img' + this._getAttributeString(attributes);
			if (this.isXhtml()) {
				return imgTag + ' />';
			}
			return imgTag + '>';
		case HtmlTagBuilderTypes.TYPE_LINE_BREAK:
			if (this.isXhtml()) {
				return '<br />';
			}
			return '<br>';
		case HtmlTagBuilderTypes.TYPE_LINK_BEGIN:
			return '<a' + this._getAttributeString(attributes) + '>';
		case HtmlTagBuilderTypes.TYPE_LINK_END:
			return '</a>';
	}
	throw new HandlerException('Invalid tagname type ' + type);
};

HtmlTagBuilder.prototype._getAttributeString = function (attributes) {
	var attributeParts = [];
	for (var key in attributes) {
		if (!attributes.hasOwnProperty(key)) {
			continue;
		}
		var value = attributes[key];
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
};
