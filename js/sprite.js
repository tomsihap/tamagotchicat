(function (global) {
    window.Sprite = function (options) {
        this.canvas = options.canvas;
        this.context = this.canvas.getContext('2d');
        this.image = options.image;

        this.rows = options.rows;
        this.columns = options.columns;

        this.rowIndex = options.rowIndex || 0;
        this.columnIndex = options.columnIndex || 0;

        this.rowFrequency = options.rowFrequency || 0;
        this.columnFrequency = options.columnFrequency || 0;

        this.rowCircular = options.rowCircular || false;
        this.columnCircular = options.columnCircular || false;

        this.rowDirection = options.rowDirection || 1;
        this.columnDirection = options.rowDirection || 1;

        var blockWidth = this.image.width / this.columns;
        var blockHeight = this.image.height / this.rows;

        this.width = options.width || blockWidth;
        this.height = options.height || blockHeight;

        this._count = 1;
    }

    /*
     *  Private API
     */

    Sprite.prototype._updateSprite = function (dimension) {
        if (this._count % this[dimension + 'Frequency'] === 0) {
            this[dimension + 'Index'] += this[dimension + 'Direction'];

            // Revert the direction when the dimension index is at the dimension limits
            // (zero or length - 1)
            if ((!this[dimension + 'Circular']) &&
                ((this[dimension + 'Index'] === (this[dimension + 's'] - 1)) ||
                    (this[dimension + 'Index'] === 0))) {
                this[dimension + 'Direction'] *= -1;
                return;
            }
            this[dimension + 'Index'] = this[dimension + 'Index'] % this[dimension + 's'];
        }
    }

    Sprite.prototype._getClipRectangle = function () {
        var blockWidth = this.image.width / this.columns;
        var blockHeight = this.image.height / this.rows;
        return {
            x: this.columnIndex * blockWidth,
            y: this.rowIndex * blockHeight,
            width: blockWidth,
            height: blockHeight,
        };
    }

    /*
     *  Public API
     */

    Sprite.prototype.draw = function (x, y) {
        this.updateLog(x, y);
        this._updateSprite('row');
        this._updateSprite('column');

        var clip = this._getClipRectangle();
        this.context.drawImage(this.image, clip.x, clip.y, clip.width, clip.height,
            x, y, this.width, this.height);

        this._count += 1;
    }

    Sprite.prototype.updateLog = function(x, y) {
        document.getElementById('xval').innerHTML = Math.round(x);
        document.getElementById('yval').innerHTML = Math.round(y);
        if (x<borneDroite) { document.getElementById('xval').style = 'color: red'; }
        if (x>borneGauche) { document.getElementById('xval').style = 'color: red'; }
        if (y<borneHaute) { document.getElementById('xval').style = 'color: red'; }
        if (x>borneBasse) { document.getElementById('xval').style = 'color: red'; }
    }
})(window);