/**
*************************************************************
* Gridspective Custom UI function library
* Created 04/03/2013
*************************************************************
*/

// Window.load
$(window).load(function () {
    try
    {
        /** Load config data */

        /** Bind UI events */
        EventBinding();

        /** Initialize UI  */
       SetCanvasElementHeight();

        if(SetupStage() < 0)
            throw new EvalError("setup-stage-failed");

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

// Document.Ready
$(document).ready(function(){
    $(window).resize(function(){
        SetCanvasElementHeight();
        GSDesigner.MainStage.setHeight(GSDesigner.GetContentHeight());
    });
});

