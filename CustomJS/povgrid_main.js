/**
*************************************************************
* POVGRID Custom UI function library
* Created 04/03/2013
*************************************************************
*/

// Main document.ready path
$(document).ready(function () {
    try
    {
        /** Load config data */

        /** Bind UI events */

        /** Initialize UI  */
        if(CreateStage() < 0)
            var e =  new ExceptionAlert();
            throw e;
    }
    catch(ex)
    {
        if (ex instanceof ExceptionAlert) {
            alert(ex.message);
        }
        else
        {
            // Generic alert message
            alert("Generic Message");
        }
    }
    finally
    {
        // LOCK/UNLOCK/HIDE/SHOW UI based on results

        /** Cleanup  */
    }
});