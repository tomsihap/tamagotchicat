
/**
 * Functions
 */
var start;
var stop;
var run;
var walk;
var idle;
var reset;


/**
 * Params
 */

var param = {
    // Set default values
    health:     100,
    happiness:  100,
    hunger:     100,
    sleep:      100,
    x:          198,
    y:          78,
    spriteSize: 64,
}


/**
 * Set or retrieve localStorage
 */

localStorage.health     = localStorage.health ? localStorage.health : param.health;
localStorage.happiness  = localStorage.happiness ? localStorage.happiness : param.happiness;
localStorage.hunger     = localStorage.hunger ? localStorage.hunger : param.hunger;
localStorage.sleep      = localStorage.sleep ? localStorage.sleep : param.sleep;


/**
 * Flèches de direction
 */

var i_n = '<span class="icon-arrow-up2"></span>';
var i_ne = '<span class="icon-arrow-up-right2"></span>';
var i_e = '<span class="icon-arrow-right2"></span>';
var i_se = '<span class="icon-arrow-down-right2"></span>';
var i_s = '<span class="icon-arrow-down2"></span>';
var i_sw = '<span class="icon-arrow-down-left2"></span>';
var i_w = '<span class="icon-arrow-left2"></span>';
var i_nw = '<span class="icon-arrow-up-left2"></span>';


$(function () {
    // Reset les datas du chat
    reset = function() {
        localStorage.removeItem('health');
        localStorage.removeItem('happiness');
        localStorage.removeItem('hunger');
        localStorage.removeItem('sleep');
    }

    // Affiche les databar
    setDataBars = function() {
        var color = '';

        oHealth = $('#health');
        oHappiness = $('#happiness');
        oHunger = $('#hunger');
        oSleep = $('#sleep');

        oHealth.prop('aria-valuenow', localStorage.health);
        oHappiness.prop('aria-valuenow', localStorage.happiness);
        oHunger.prop('aria-valuenow', localStorage.hunger);
        oSleep.prop('aria-valuenow', localStorage.sleep);
    }

    setDataBars();

    // Bornes à ne pas dépasser pour ne pas être trop sur un côté
    var borneGauche = spriteSize;
    var borneDroite = canvas.width - spriteSize;
    var borneHaute  = spriteSize;
    var borneBasse  = canvas.height - spriteSize;
    $('#borneGauche').html(borneGauche);
    $('#borneDroite').html(borneDroite);
    $('#borneHaute').html(borneHaute);
    $('#borneBasse').html(borneBasse);


    
    // Config de mouvement
    var config = new function() {
        this.speed = 20,
        this.ratio = 1.4,
        this.side = this.speed/this.ratio,
        this.move = this.speed
    };


    /**
     * Variables de fonctionnement
     */
    var animate = '';                           // setInterval d'une animation
    var isWalking, isRunning, isIdle = false;   // states
    var x = param.x;                            // valeur de x au démarrage
    var y = param.y;                            // valeur de y au démarrage
    var spriteSize = config.spriteSize;         // Taille des sprites



    // Configuration des sprites
    var sprites = {
        'run_n': {
            image: 'run', rows: 4, columns: 4, rowIndex: 3, speed: 2,
            updateX: 0,
            updateY: -config.move,
        },
        'run_ne': {
            image: 'runSide', rows: 4, columns: 4, rowIndex: 3, speed: 2,
            updateX: config.side,
            updateY: -config.side,
        },
        'run_e': {
            image: 'run', rows: 4, columns: 4, rowIndex: 2, speed: 2,
            updateX: config.move,
            updateY: 0,
        },
        'run_se': {
            image: 'runSide', rows: 4, columns: 4, rowIndex: 1, speed: 2,
            updateX: config.side,
            updateY: config.side,
        },
        'run_s': {
            image: 'run', rows: 4, columns: 4, rowIndex: 0, speed: 2,
            updateX: 0,
            updateY: config.move,
        },
        'run_sw': {
            image: 'runSide', rows: 4, columns: 4, rowIndex: 0, speed: 2,
            updateX: -config.side,
            updateY: config.side,
        },
        'run_w': {
            image: 'run', rows: 4, columns: 4, rowIndex: 1, speed: 2,
            updateX: -config.move,
            updateY: 0,
        },
        'run_nw': {
            image: 'runSide', rows: 4, columns: 4, rowIndex: 2, speed: 2,
            updateX: -config.side,
            updateY: -config.side,
        },
        'walk_n': {
            image: 'walk', rows: 4, columns: 4, rowIndex: 3, speed: 1,
            updateX: 0,
            updateY: -config.move,
        },
        'walk_ne': {
            image: 'walkSide', rows: 4, columns: 4, rowIndex: 3, speed: 1,
            updateX: config.side,
            updateY: -config.side,
        },
        'walk_e': {
            image: 'walk', rows: 4, columns: 4, rowIndex: 2, speed: 1,
            updateX: config.move,
            updateY: 0,
        },
        'walk_se': {
            image: 'walkSide', rows: 4, columns: 4, rowIndex: 1, speed: 1,
            updateX: config.side,
            updateY: config.side,
        },
        'walk_s': {
            image: 'walk', rows: 4, columns: 4, rowIndex: 0, speed: 1,
            updateX: 0,
            updateY: config.move,
        },
        'walk_sw': {
            image: 'walkSide', rows: 4, columns: 4, rowIndex: 0, speed: 1,
            updateX: -config.side,
            updateY: config.side,
        },
        'walk_w': {
            image: 'walk', rows: 4, columns: 4, rowIndex: 1, speed: 1,
            updateX: -config.move,
            updateY: 0,
        },
        'walk_nw': {
            image: 'walkSide', rows: 4, columns: 4, rowIndex: 2, speed: 1,
            updateX: -config.side,
            updateY: -config.side,
        },
        'blink': {
            image: 'blink', rows: 1, columns: 2, rowIndex: 0, speed: 1,
            updateX:0, updateY: 0,
        },
        'ennui': {
            image: 'ennui', rows: 1, columns: 4, rowIndex: 0, speed: 1,
            updateX: 0, updateY: 0,
        },
        'attack': {
            image: 'attack', rows: 1, columns: 4, rowIndex: 0, speed: 1,
            updateX: 0, updateY: 0,
        }
    };

    // Arrêter l'animation
    stop = function () {
        clearInterval(animate);
    }

    // Animation Run/RunSide
    run = function (direction) {
        if (animate !== '') { stop(); }

        isRunning = true;
        $('#state').html('running');

        
        var mySprite = sprites[direction];

        var rowIndex = mySprite.rowIndex;
        var image = mySprite.image;

        var updateX = mySprite.updateX;
        var updateY = mySprite.updateY;

        var sprite = new Sprite({
            image: document.getElementById(image),
            rowIndex: rowIndex,

            canvas: document.getElementById('canvas'),
            rows: mySprite.rows,
            columns: mySprite.columns,
            columnIndex: 0,
            rowFrequency: 0,
            columnFrequency: 1,
            rowCircular: true,
            columnCircular: true
        });

        var canvas = sprite.canvas;


        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        function loop() {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            sprite.draw(x, y);
            x += updateX;
            y += updateY;
            if (x > canvas.width-80) { x=canvas.width-81; idle('blink'); }
            if (x < 0) { x=1; idle('blink') }
            if (y > canvas.height-80) { y=canvas.height-81; idle('blink'); }
            if (y < 0) { y=1; idle('blink') }
        }

        animate = setInterval(loop, 100);
    }

    // Animation Walk/WalkSide
    walk = function (direction) {

        isWalking = true;
        $('#state').html('walking');

        if (animate !== '') { stop(); }

        var mySprite = sprites[direction];

        var rowIndex = mySprite.rowIndex;
        var image = mySprite.image;

        var updateX = mySprite.updateX;
        var updateY = mySprite.updateY;

        var sprite = new Sprite({
            image: document.getElementById(image),
            rowIndex: rowIndex,

            canvas: document.getElementById('canvas'),
            rows: mySprite.rows,
            columns: mySprite.columns,
            columnIndex: 0,
            rowFrequency: 0,
            columnFrequency: 1,
            rowCircular: true,
            columnCircular: true
        });

        var canvas = sprite.canvas;


        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        function loop() {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            sprite.draw(x, y);
            x += updateX;
            y += updateY;

            willItMove = Math.floor(Math.random() * ((1 - 0) + 1) + 1);
            
            if (x >= canvas.width - 80) { x = canvas.width - 81; willItMove == 1 ? randomWalk() : idle('blink'); }
            if (x <= 0) { x = 1; idle('blink') }
            if (y >= canvas.height - 80) { y = canvas.height - 81; willItMove == 1 ? randomWalk() : idle('blink'); }
            if (y <= 0) { y = 1; idle('blink') }
            
           
        }


        animate = setInterval(loop, 200);
    }

    // Animations Idle (param: quelle )
    idle = function (sprite) {
        if (animate !== '') { stop(); }

        isIdle = true;
        $('#state').html('idle');

        var mySprite = sprites[sprite];
        var speed    = sprites[sprite].speed * config.speed;

        var rowIndex = mySprite.rowIndex;
        var image = mySprite.image;

        var sprite = new Sprite({
            image: document.getElementById(image),
            rowIndex: rowIndex,

            canvas: document.getElementById('canvas'),
            rows: mySprite.rows,
            columns: mySprite.columns,
            columnIndex: 0,
            rowFrequency: 0,
            columnFrequency: 1,
            rowCircular: true,
            columnCircular: true
        });

        var canvas = sprite.canvas;
        var frequences = [
            [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
        ];
        var i = 0;
        var freqRow = Math.floor((Math.random() * 10));
        
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        willItMove = Math.floor(Math.random() * ((1 - 0) + 1) + 1);

        function loop() {
            sprite.columnFrequency = frequences[freqRow][i];
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            sprite.draw(x, y);
            // On réinitialise i pour executer la fréquence en boucle
            if (i >= frequences[freqRow].length) { i = 0 } else { i++; }
        }

        animate = setInterval(loop, 100);
    }

    // FIX: Pour Walk/Run (todo), où peut aller le chat selon sa position ?
    whereCanIWalk = function() {
        var availableMoves = [];

        if (x < borneGauche) {
            if (y < borneHaute) {
                $('#etatval').html('trop haut gauche: '+i_se);
                $('#xval').css('color', 'red');
                $('#yval').css('color', 'red');
                availableMoves = ['walk_se'];
            }
            if (y > borneBasse) {
                $('#etatval').html('trop bas gauche' + i_ne);
                $('#xval').css('color', 'red');
                $('#yval').css('color', 'red');
                availableMoves = ['walk_ne'];
            }
            else {
                $('#etatval').html('trop gauche'+i_n+i_ne+i_e+i_se+i_s);
                $('#xval').css('color', 'red');
                availableMoves = ['walk_n', 'walk_ne', 'walk_e', 'walk_se', 'walk_s'];
            }
        }
        else if (x > borneDroite) {
            if (y < borneHaute) {
                $('#etatval').html('trop droite haut' + i_sw);
                $('#xval').css('color', 'red');
                $('#yval').css('color', 'red');                
                availableMoves = ['walk_sw'];
            }
            if (y > borneBasse) {
                $('#etatval').html('trop droite bas' + i_nw);
                $('#xval').css('color', 'red');
                $('#yval').css('color', 'red');
                availableMoves = ['walk_nw'];
            }
            else {
                $('#etatval').html('trop gauche' + i_nw + i_w + i_sw);
                $('#xval').css('color', 'red');
                availableMoves = ['walk_nw', 'walk_w', 'walk_sw'];
            }
        }
        else if (y > borneBasse) {
            if (x < borneGauche) {
                $('#etatval').html('trop bas gauche' + i_ne);
                $('#xval').css('color', 'red');
                $('#yval').css('color', 'red');
                availableMoves = ['walk_ne'];
            }
            if (x > borneDroite) {
                $('#etatval').html('trop droite bas' + i_nw);
                $('#xval').css('color', 'red');
                $('#yval').css('color', 'red');
                availableMoves = ['walk_nw'];
            }
            else {
                $('#etatval').html('trop bas' + i_nw + i_n + i_ne);
                $('#yval').css('color', 'red');
                availableMoves = ['walk_nw', 'walk_n', 'walk_ne'];
            }
        }
        else if (y < borneHaute) {
            console.log('trop haut... x : '+x);
            if (x<borneGauche) {
                $('#etatval').html('trop haut gauche' + i_se);
                $('#xval').css('color', 'red');
                $('#yval').css('color', 'red');
                availableMoves = ['walk_se'];
                
            }
            if (x>borneDroite) {
                $('#etatval').html('trop haut droite' + i_sw);
                $('#xval').css('color', 'red');
                $('#yval').css('color', 'red');
                availableMoves = ['walk_sw'];
            }
            else {
                $('#etatval').html('trop haut' + i_sw + i_s + i_se);
                $('#yval').css('color', 'red');
                availableMoves = ['walk_sw', 'walk_s', 'walk_se'];
            }
            
            
        }
        else {
            $('#etatval').html('libre');
            availableMoves = [
                'walk_n',
                'walk_nw',
                'walk_ne',
                'walk_w',
                'walk_e',
                'walk_sw',
                'walk_se',
                'walk_s',
            ];
        }
        return availableMoves;
    }

    // TODO: déplacement aléatoire
    randomWalk = function() {
        stop();

        function loop() {
            availableMoves = whereCanIWalk();
            var currentMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            $('#randmovedir').html(currentMove);
            walk(currentMove);
        }
       
        animate = setInterval(loop, 100);
        
    }

    // Object Cat
    cat = function(health, happiness, hunger, sleep) {
        this.health         = health;
        this.happiness      = happiness;
        this.hunger         = hunger;
        this.sleep          = sleep;
        this.isConstructed  = false;

        this.__construct = function() {
            console.log('in construction');
            this.isConstructed = true;

            console.log('health : ' + this.health);
        }

        this.setHealth = function(value) {
            this.health = value;
            return this.health;
        }
        this.setHappiness = function(value) {
            this.happiness = value;
            return this.happiness;
        }
        this.setHunger = function(value) {
            this.hunger = value;
            return this.hunger;
        }
        this.setSleep = function (value) {
            this.sleep = value;
            return this.sleep;
        }

        this.getHealth       = function () { return this.health;}
        this.getHappiness    = function () { return this.happiness;}
        this.getHunger       = function () { return this.hunger; }
        this.getSleep        = function () { return this.sleep; }


        feed = function(value = null) {
            setHealth(this.health + value * ratioFeedHealth);
            setHappiness(this.happiness + value*ratioFeedHappiness);
            setHunger(this.hunger + value);
            setSleep(this.sleep + value*ratioFeedSleep);
        }

        play = function(value = null) {
            setHealth(this.health + value * ratioPlayHealth);
            setHappiness(this.happiness + value);
            setHunger(this.hunger + value*ratioPlayHunger);
            setSleep(this.sleep + value*ratioPlaySleep);
        }

        rest = function (value = null) {
            setHealth(this.health + value * ratioRestHealth);
            setHappiness(this.happiness * ratioRestHappiness);
            setHunger(this.hunger + value * ratioRestHunger);
            setSleep(this.sleep + value*ratioRestSleep);
        }

        cure = function(value = null) {
            setHealth(this.health + value * ratioCureHealth);
            setHappiness(this.happiness * ratioCureHappiness);
            setHunger(this.hunger + value * ratioCureHunger);
            setSleep(this.sleep + value * ratioCureSleep);
        }

        if (this.isConstructed == false) { console.log('constructing'); this.__construct(); }
    }
});