function hasCurrentUserRole(roleName) {
    let hasRole = false;
    let roles = Xrm.Utility.getGlobalContext().userSettings.roles;
    roles.forEach(x => {
        if (x.name === roleName) {
            hasRole = true;
            return;
        }
    });
    return hasRole;
}

function unlockTesterFields(executionContext) {
    // Initialize formContext and Comtrols, get tab visibility


    var formContext = executionContext.getFormContext();
    let hasTesterRole = hasCurrentUserRole("MICS_ZonalOwnerRole");
    let hasOwnerRole = hasCurrentUserRole("MICS_ControlOwnerRole")
    var evidenceComments = formContext.getControl('new_comment');
    evidenceComments.setDisabled(true)
    var evidence1 = formContext.getControl('new_evidence');
    var evidence2 = formContext.getControl('new_evidence2');
    var evidence3 = formContext.getControl('new_evidence3');
    var evidenceUrl = formContext.getControl('new_evidenceurl');
    evidence1.setDisabled(true)
    evidence2.setDisabled(true)
    evidence3.setDisabled(true)
    evidenceUrl.setDisabled(true)
    var testerAction = formContext.getControl('crf10_testeractiononevidence');
    testerAction.setDisabled(true)
    var testerRemarks = formContext.getControl('crf10_testerremarks');
    testerRemarks.setDisabled(true)
    var testerActionValue = formContext.getAttribute('crf10_testeractiononevidence').getValue()
    var responseValue = formContext.getAttribute('crf10_hascoresponded').getValue()
    var IsTesterNotifiedValue = formContext.getAttribute('crf10_istesternotified').getValue()    
    var acceptedByEmail = formContext.getAttribute('crf10_acceptedbyemail').getValue()

    if (formContext != undefined && formContext.ui != undefined) {

        if (hasTesterRole && responseValue === true && testerActionValue != 1000) {
            testerAction.setDisabled(false)
            testerRemarks.setDisabled(false)
        }
        if (hasOwnerRole && responseValue === false) {
            evidenceComments.setDisabled(false)
            evidence1.setDisabled(false)
            evidence2.setDisabled(false)
            evidence3.setDisabled(false)
            evidenceUrl.setDisabled(false)
        }
        if (hasOwnerRole && responseValue === true &&  IsTesterNotifiedValue == false && acceptedByEmail != "") {
            evidenceComments.setDisabled(false)
            evidence1.setDisabled(false)
            evidence2.setDisabled(false)
            evidence3.setDisabled(false)
            evidenceUrl.setDisabled(false)
        }        
    }
}