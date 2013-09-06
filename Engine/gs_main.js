/**
*************************************************************
* Gridspective Custom UI function library
* Created 04/03/2013
*************************************************************
*/

// Main document.ready path
$(document).ready(function () {
    try
    {
        /** Load config data */

        /** Bind UI events */
        EventBinding();

        /** Initialize UI  */
        SetCanvasElementHeight();

        if(SetupStage() < 0)
            throw new EvalError("setup-stage-failed");

        /*
        if(CreateTouchLayer() < 0)
            throw new EvalError("create-touchlayer-failed");
        */


        disableSelection(document.body);
    }
    catch(ex)
    {
        if (ex instanceof EvalError) {
            LogError(ex.message);
        }
        else
        {
            // Generic error
            LogError(ex.message);
        }
    }
    finally
    {
        // LOCK/UNLOCK/HIDE/SHOW UI based on results

        /** Cleanup  */

    }
});