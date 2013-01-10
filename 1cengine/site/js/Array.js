(function(A) {
    /**
     * Возвращает номер, под которым находится object в массиве, или -1, если object не нашелся.
     * Поиск ведется с начала массива.
     * @param {mixed} object Искомый объект.
     * @return {Number} Индекс элемента или -1, если не найден.
     */
    A.indexOf = A.indexOf || function(object) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === object) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Возвращает номер, под которым находится object в массиве, или -1, если object не нашелся.
     * Поиск ведется с конца массива.
     * @param {mixed} object Искомый объект.
     * @return {Number} Индекс элемента или -1, если не найден.
     */
    A.lastIndexOf = A.lastIndexOf || function(object) {
        for (var i = this.length - 1; i >= 0; i--) {
            if (i in this && this[i] === object) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Перебирает элементы массива и для каждого вызывает fn в контексте thisObj. В fn передаются следующие
     * параметры <ul>
     *      <li>элемент массива;</li>
     *      <li>текущий индекс;</li>
     *      <li>ссылка на сам массив.</li>
     * </ul>
     * @param {Function} fn Callback-функция.
     * @param {Object} thisObj Контекст вызова.
     */
    A.forEach = A.forEach || function(fn, thisObj) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this) {
                fn.call(thisObj, this[i], i, this);
            }
        }
    };

    /**
     * Возвращает массив, содержащий элементы исходного массива после обработки функцией fn, вызванной в
     * контексте thisObj. Вызов fn аналогичен {@link #forEach}.
     * @param {Function} fn Callback-функция.
     * @param {Object} thisObj Контекст вызова.
     * @return {Array} Результирующий массив.
     */
    A.map = A.map || function(fn, thisObj) {
        var result = [];
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this) {
                result[i] = fn.call(thisObj, this[i], i, this);
            }
        }
        return result;
    };

    /**
     * Возвращает массив, содержащий только те элементы исходного массива, для которых fn вернула
     * истинное значение. Вызов fn аналогичен {@link #forEach}.
     * @param {Function} fn Callback-функция.
     * @param {Object} thisObj Контекст вызова.
     * @return {Array} Результирующий массив.
     */
    A.filter = A.filter || function(fn, thisObj) {
        var result = [];
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && fn.call(thisObj, this[i], i, this)) {
                result.push(this[i]);
            }
        }
        return result;
    };

    /**
     * Возвращает true, если fn для каждого элемента массива вернула истинное значение. Вызов fn
     * аналогичен {@link #forEach}.
     * @param {Function} fn Callback-функция.
     * @param {Object} thisObj Контекст вызова.
     * @return {Boolean}
     */
    A.every = A.every || function(fn, thisObj) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && !fn.call(thisObj, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };

    /**
     * Возвращает true, если fn хотя бы для одного элемента массива вернула истинное значение.
     * После первого найденного истинного значения перебор прекращается. Вызов fn аналогичен
     * {@link #forEach}.
     * @param {Function} fn Callback-функция.
     * @param {Object} thisObj Контекст вызова.
     * @return {Boolean}
     */
    A.some = A.some || function(fn, thisObj) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && fn.call(thisObj, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };

    /**
     * Итеративно сводит массив к единственному значению (возможно к другому массиву). Если параметр
     * init не задан, то им становится первый элемент массива (не элемент с индексом 0, а первый
     * элемент). На первой итерации в fn первым параметром передается init, на последующих — результат
     * выполнения на предыдущей итерации. Вторым параметром в fn передается очередной элемент
     * массива. Если init не передан, то перебор, соответственно, начинается со второго элемента.
     * Возвращается результат выполнения функции fn на последней итерации. Если вызывается у пустого
     * массива и не передан init, то бросается исключение TypeError.
     * @param {Function} fn Callback-функция.
     * @param {mixed} init Инициирующее значение.
     * @return {mixed} Результат последнего вызова fn.
     */
    A.reduce = A.reduce || function(fn, init) {
        var i = 0, l = this.length;
        if (arguments.length < 2) {
            if (this.length == 0) {
                throw new TypeError('reduce of empty array with no initial value');
            }
            for (; i < l; i++) {
                if (i in this) {
                    init = this[i];
                    i++;
                    break;
                }
            }
        }
        for (; i < l; i++) {
            if (i in this) {
                init = fn(init, this[i], i, this);
            }
        }
        return init;
    };

    /**
     * То же самое, что {@link #reduce}, но перебор ведется с конца массива.
     * @param {Function} fn Callback-функция.
     * @param {mixed} init Инициирующее значение.
     * @return {mixed} Результат последнего вызова fn.
     */
    A.reduceRight = A.reduceRight || function(fn, init) {
        var i = this.length - 1;
        if (arguments.length < 2) {
            if (this.length == 0) {
                throw new TypeError('reduce of empty array with no initial value');
            }
            for (; i >= 0; i--) {
                if (i in this) {
                    init = this[i];
                    i--;
                    break;
                }
            }
        }
        for (; i >= 0; i--) {
            if (i in this) {
                init = fn(init, this[i], i, this);
            }
        }
        return init;
    };
})(Array.prototype);
