
var bookingCounter = function(selector, options){

    this.selector = selector; 
    this.values = {};   
    this.countValMin = options.countValMin || 5;
    this.countValMax = options.countValMax || 12;
    
    this.init = function(){
        var containers = document.querySelectorAll(this.selector);        
        containers = Array.from(containers);
        this.getValues();
        var that = this;
        containers.forEach(function(item, key){
            item.innerHTML = that.getTemplate(that.values);
        })
    }


    this.generateValues = function(){    
        var data = {
            count: this.getRandomInt(this.countValMin, this.countValMax),
            hoursAgo: this.getHours()
        } 
        console.log(this);
        localStorage.setItem('bookingData', JSON.stringify(data));
        this.values = data;        
    }


    this.getValues = function(){
        var data = localStorage.getItem('bookingData');
        if(!data) {
            this.generateValues();
        } else {
            this.values = JSON.parse(data);
        }
    }


    this.getTemplate = function(values){
    return '<div class="buy-trigger">' +
                '<div class="buy-trigger__counter">Сегодня забронировано <b>'+ values.count +' раз</b></div>' +
                '<div class="buy-trigger__last">Последний раз: '+ values.hoursAgo +' назад</div>' +
            '</div>';
    }


    this.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    this.getHours = function(){
        var num = this.getRandomInt(2,20);
        if(num >= 2 && num < 5) {
            return num + ' часа';
        } else {
            return num + ' часов';
        }
    }
}