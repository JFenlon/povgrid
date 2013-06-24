/**
 *************************************************************
 * POVGRID Custom generic functions library
 * Created 06/24/2013
 *************************************************************
 */

// Exception to throw and alert user when something goes wrong
/** EXAMPLE
try {
    // some function/code that can throw
    if (isNaN(value))
        throw new NotNumberException();
    else
    if (value < 0)
        throw new NotPositiveNumberException();
}
catch (e) {
    if (e instanceof NotNumberException) {
        alert("not a number");
    }
    else
    if (e instanceof NotPositiveNumberException) {
        alert("not a positive number");
    }
}
*/
function ExceptionAlert()
{ //Log error
    this.message = "CUSTOM MESSAGE";
}
ExceptionAlert.prototype = Error.prototype;

// Simple, returns the DOM element that matches the passed ID
function getDomElement( id ) {
    return $( '#' + id );
}