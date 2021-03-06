var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ProcessKeyCombo = require('./ProcessKeyCombo');
var ResetKeyCombo = require('./ResetKeyCombo');

/**
 * @classdesc
 * [description]
 *
 * `keys` argument can be:
 * 
 * A string (ATARI)
 * An array of either integers (key codes) or strings, or a mixture of both
 * An array of objects (such as Key objects) with a public 'keyCode' property
 *
 * @class KeyCombo
 * @memberOf Phaser.Input.Keyboard
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.KeyboardManager} keyboardManager - [description]
 * @param {string|integers[]|object[]} keys - [description]
 * @param {object} [config] - [description]
 */
var KeyCombo = new Class({

    initialize:

    function KeyCombo (keyboardManager, keys, config)
    {
        if (config === undefined) { config = {}; }

        //  Can't have a zero or single length combo (string or array based)
        if (keys.length < 2)
        {
            return false;
        }

        /**
         * [description]
         *
         * @property {Phaser.Input.Keyboard.KeyboardManager} manager
         * @since 3.0.0
         */
        this.manager = keyboardManager;

        /**
         * [description]
         *
         * @property {boolean} enabled
         * @default true
         * @since 3.0.0
         */
        this.enabled = true;

        /**
         * [description]
         *
         * @property {array} keyCodes
         * @default []
         * @since 3.0.0
         */
        this.keyCodes = [];

        //  if 'keys' is a string we need to get the keycode of each character in it

        for (var i = 0; i < keys.length; i++)
        {
            var char = keys[i];

            if (typeof char === 'string')
            {
                this.keyCodes.push(char.toUpperCase().charCodeAt(0));
            }
            else if (typeof char === 'number')
            {
                this.keyCodes.push(char);
            }
            else if (char.hasOwnProperty('keyCode'))
            {
                this.keyCodes.push(char.keyCode);
            }
        }

        /**
         * The current keyCode the combo is waiting for.
         *
         * @property {[type]} current
         * @since 3.0.0
         */
        this.current = this.keyCodes[0];

        /**
         * The current index of the key being waited for in the 'keys' string.
         *
         * @property {number} index
         * @default 0
         * @since 3.0.0
         */
        this.index = 0;

        /**
         * The length of this combo (in keycodes)
         *
         * @property {[type]} size
         * @since 3.0.0
         */
        this.size = this.keyCodes.length;

        /**
         * The time the previous key in the combo was matched.
         *
         * @property {number} timeLastMatched
         * @default 0
         * @since 3.0.0
         */
        this.timeLastMatched = 0;

        /**
         * Has this Key Combo been matched yet?
         *
         * @property {boolean} matched
         * @default false
         * @since 3.0.0
         */
        this.matched = false;

        /**
         * The time the entire combo was matched.
         *
         * @property {number} timeMatched
         * @default 0
         * @since 3.0.0
         */
        this.timeMatched = 0;

        /**
         * If they press the wrong key do we reset the combo?
         *
         * @property {boolean} resetOnWrongKey
         * @default 0
         * @since 3.0.0
         */
        this.resetOnWrongKey = GetFastValue(config, 'resetOnWrongKey', true);

        /**
         * The max delay in ms between each key press. Above this the combo is reset. 0 means disabled.
         *
         * @property {integer} maxKeyDelay
         * @default 0
         * @since 3.0.0
         */
        this.maxKeyDelay = GetFastValue(config, 'maxKeyDelay', 0);

        /**
         * If previously matched and they press Key 1 again, will it reset?
         *
         * @property {boolean} resetOnMatch
         * @default false
         * @since 3.0.0
         */
        this.resetOnMatch = GetFastValue(config, 'resetOnMatch', false);

        /**
         * If the combo matches, will it delete itself?
         *
         * @property {boolean} deleteOnMatch
         * @default false
         * @since 3.0.0
         */
        this.deleteOnMatch = GetFastValue(config, 'deleteOnMatch', false);

        var _this = this;

        var onKeyDownHandler = function (event)
        {
            if (_this.matched || !_this.enabled)
            {
                return;
            }

            var matched = ProcessKeyCombo(event, _this);

            if (matched)
            {
                _this.manager.emit('keycombomatch', _this, event);

                if (_this.resetOnMatch)
                {
                    ResetKeyCombo(_this);
                }
                else if (_this.deleteOnMatch)
                {
                    _this.destroy();
                }
            }
        };

        /**
         * [description]
         *
         * @property {function} onKeyDown
         * @since 3.0.0
         */
        this.onKeyDown = onKeyDownHandler;

        this.manager.on('keydown', onKeyDownHandler);
    },

    /**
     * How far complete is this combo? A value between 0 and 1.
     * 
     * @name Phaser.Input.Keyboard.KeyCombo#progress
     * @property {number} progress
     * @readOnly
     * @since 3.0.0
     */
    progress: {

        get: function ()
        {
            return this.index / this.size;
        }

    },

    /**
     * [description]
     *
     * @method Phaser.Input.Keyboard.KeyCombo#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.enabled = false;
        this.keyCodes = [];

        this.manager.off('keydown', this.onKeyDown);
        this.manager = undefined;
    }

});

module.exports = KeyCombo;
