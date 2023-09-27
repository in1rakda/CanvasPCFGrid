function getStage(executionContext) {
    var context = executionContext
    var formContext = executionContext.getFormContext();
    var Stage = formContext.data.process.getActiveStage();
    var StageName = Stage.getName();

    if (StageName == "Design Effectiveness") {

        formContext.ui.tabs.get("BasicInformation").setVisible(true);
        formContext.ui.tabs.get("TestingTerminated").setVisible(false);
        formContext.ui.tabs.get("DesignEffectiveness").setVisible(true);
        formContext.ui.tabs.get("DesignEffectiveness").setFocus();
        formContext.ui.tabs.get("OperationalEffectiveness").setVisible(false);
        designEffectivenessTab(context);
    }

    else if (StageName == "Operational Effectiveness") {
        formContext.ui.tabs.get("BasicInformation").setVisible(true);
        formContext.ui.tabs.get("TestingTerminated").setVisible(false);
        formContext.ui.tabs.get("DesignEffectiveness").setVisible(true);
        formContext.ui.tabs.get("OperationalEffectiveness").setVisible(true);
        formContext.ui.tabs.get("OperationalEffectiveness").setFocus();
        designEffectivenessTab(context);
        oeTab(context);

    }
}
async function retrieveOperation() {
    var loggedinUserId = Xrm.Utility.getGlobalContext().userSettings.userId.replace("{", "").replace("}", "");
    var results = await Xrm.WebApi.retrieveRecord("systemuser", loggedinUserId, "?$select=internalemailaddress");
    var internalemailaddress = results.internalemailaddress;
    console.log("retrieve operation completed successfully.");
    return internalemailaddress;

}

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

async function designEffectivenessTab(executionContext) {
    // Initialize formContext and Comtrols, get tab visibility


    var formContext = executionContext.getFormContext();
    var processStage = formContext.data.process.getActiveStage();
    var processStageName = processStage.getName();
    await retrieveOperation().then((fetcheduser) => {
        let currentUser = fetcheduser.toLowerCase();
        console.log("Current User is " + currentUser)
        var dETab = formContext.ui.tabs.get("DesignEffectiveness");
        var ownerSection = dETab.sections.get("COAction");
        let hasTesterRole = hasCurrentUserRole("MICS_ZonalOwnerRole");
        let isOwner = (currentUser == (formContext.getAttribute("new_controlowneremail").getValue() != null ? formContext.getAttribute("new_controlowneremail").getValue().toLowerCase() : null));
        let isTester = (currentUser == (formContext.getAttribute("new_preparer").getValue() != null ? formContext.getAttribute("new_preparer").getValue().toLowerCase() : null))
        var controlStatus = formContext.getAttribute('new_controlstatus').getValue();
        var designdocumentationdetails = formContext.getControl('new_designdocumentation');
        designdocumentationdetails.setDisabled(true);
        var designdocumentationevidences = formContext.getControl('new_designevidences');
        designdocumentationevidences.setDisabled(true);
        var designSteps = formContext.getControl('new_testofdesign');
        designSteps.setDisabled(true);
        var questionaire1 = formContext.getControl("new_controldesignedimplementedasperrequirement");
        questionaire1.setDisabled(true);
        var questionaire1Value = (formContext.getAttribute("new_controldesignedimplementedasperrequirement").getValue() != null ? formContext.getAttribute("new_controldesignedimplementedasperrequirement").getValue() : null);
        var questionaire2 = formContext.getControl("new_anychangeincontroldesigninlast12months");
        questionaire2.setDisabled(true);
        var additionalrecipients1 = formContext.getControl("new_additionalrecipient1lookup");
        additionalrecipients1.setDisabled(true);
        var additionalrecipients2 = formContext.getControl("new_additionalrecipient2lookup");
        additionalrecipients2.setDisabled(true);
        var deNotifyOwner = formContext.getControl("WebResource_tooddNotifyOwner");
        deNotifyOwner.setVisible(false);
        var testerEmail = formContext.getControl("new_preparer");
        testerEmail.setDisabled(true);
        var reviewerEmail = formContext.getControl("new_reviewerlookup");
        reviewerEmail.setDisabled(true);
        var auditPeriodFrom = formContext.getControl("new_auditperiodfrom");
        auditPeriodFrom.setDisabled(true);
        var auditPeriodTo = formContext.getControl("new_auditperiodto");
        auditPeriodTo.setDisabled(true);
        var isControlApplicable = formContext.getControl("crf10_isthecontrolapplicable");
        isControlApplicable.setDisabled(true);
        var controlApplicabilityValue = (formContext.getAttribute("crf10_isthecontrolapplicable").getValue() != null ? formContext.getAttribute("crf10_isthecontrolapplicable").getValue() : null);


        //Owner Fields
        var designAcceptance = formContext.getControl("new_designacceptance");
        designAcceptance.setDisabled(true)
        var designAcceptanceValue = (formContext.getAttribute("new_designacceptance").getValue() != null ? formContext.getAttribute("new_designacceptance").getValue() : null);
        var designEffectiviness = formContext.getControl("new_designeffectiviness");
        designEffectiviness.setDisabled(true)
        var designEffectivinessValue = (formContext.getAttribute("new_designeffectiviness").getValue() != null ? formContext.getAttribute("new_designeffectiviness").getValue() : null);
        var ddAcceptanceComments = formContext.getControl("new_ddcontrolownercomments");
        ddAcceptanceComments.setDisabled(true)
        var ddEffectivenessComments = formContext.getControl("new_dddesigneffectivenesscontrolownercomments");
        ddEffectivenessComments.setDisabled(true)

        // information fields

        var teamsInvolved = formContext.getControl("new_teamsinvolved");
        teamsInvolved.setDisabled(true)
        var ddTestingPerformed = formContext.getControl("new_ddtestingperformed");
        ddTestingPerformed.setDisabled(true)

        // OE fileds

        var testOfOneTab = formContext.ui.tabs.get("OperationalEffectiveness");
        var OEcontrolStatus = formContext.getAttribute('new_controlstatus').getValue();
        var isTabVisible = testOfOneTab.getVisible();
        var reviewerSection = testOfOneTab.sections.get("ReviewerSection");
        reviewerSection.setVisible(false);
        var CoSection = testOfOneTab.sections.get("OwnerSection");
        CoSection.setVisible(false);
        var populationDetails = formContext.getControl('new_toopopulationdetails');
        populationDetails.setDisabled(true);
        var populationChoiceControl = formContext.getControl('new_toopopulationdatasufficient');
        populationChoiceControl.setDisabled(true);
        var sampleDetails = formContext.getControl("new_toosampledetails");
        sampleDetails.setDisabled(true);
        var populationRemarks = formContext.getControl('new_toopopulationdataremarks');
        populationRemarks.setDisabled(true);
        var populationFileControl = formContext.getControl("new_toopopulationdata");
        populationFileControl.setDisabled(true);
        var notifyOwner = formContext.getControl("WebResource_tooNotifyOwner");
        notifyOwner.setVisible(false);
        var notifyTester = formContext.getControl("WebResource_tooNotifyTester");
        notifyTester.setVisible(false);
        var evidenceFileControl = formContext.getControl("new_sampledata");
        evidenceFileControl.setDisabled(true);
        var evidenceChoiceControl = formContext.getControl("new_tooisevidencesufficient");
        evidenceChoiceControl.setDisabled(true);
        var evidenceRemarks = formContext.getControl("new_sampledataremarks");
        evidenceRemarks.setDisabled(true);
        var controlOwnerConsent = formContext.getControl("new_toocontrolownerconsenttotestconclusion");
        controlOwnerConsent.setDisabled(true);
        var controlOwnerConsentRemarks = formContext.getControl("new_toocontrolownerremarks");
        controlOwnerConsentRemarks.setDisabled(true);
        var notifyReviewer = formContext.getControl("WebResource_tooNotifyReviewer");
        notifyReviewer.setVisible(false);
        var reviewerConsent = formContext.getControl("new_tooconsenttotestconclusion");
        reviewerConsent.setDisabled(true);
        var reviewerRemarks = formContext.getControl("new_tooreviewerremarks");
        reviewerRemarks.setDisabled(true);
        var isCTUploadEvidence = formContext.getControl("crf10_tooisctuploadevidence");
        isCTUploadEvidence.setDisabled(true);
        var evidenceUrl = formContext.getControl("new_evidenceurl");
        evidenceUrl.setDisabled(true);
        var isCTUploadSample = formContext.getControl("crf10_toocttouploadsample");
        isCTUploadSample.setDisabled(true);
        var sampleUrl = formContext.getControl("crf10_toosampleurl");
        sampleUrl.setDisabled(true);
        var oeTestSteps = formContext.getControl("new_tooteststeps");
        oeTestSteps.setDisabled(true);
        var oeTestingPerformed = formContext.getControl('new_oetestingperformed');
        oeTestingPerformed.setDisabled(true);
        var oeTestingPerformedattachment = formContext.getControl('crf10_tootestingperformedattachment');
        oeTestingPerformedattachment.setDisabled(true);
        var testConclusion = formContext.getControl('new_testconclusion');
        testConclusion.setDisabled(true);
        var additionalDocumentation = formContext.getControl('new_tooadditionaldocumentation');
        additionalDocumentation.setDisabled(true);
        var areSamplesRequired = formContext.getControl('crf10_issamplesrequired');
        areSamplesRequired.setDisabled(true);
        var areSamplesRequiredValue = formContext.getAttribute('crf10_issamplesrequired').getValue();

        // Check conditions & Enable Controls
        if (formContext != undefined && formContext.ui != undefined && processStageName == "Design Effectiveness") {

            if (hasTesterRole && controlStatus == 100000011) { // status = "to be initiated"
                designdocumentationdetails.setDisabled(false);
                designdocumentationevidences.setDisabled(false);
                designSteps.setDisabled(false);
                ddTestingPerformed.setDisabled(false)
                questionaire1.setDisabled(false);
                questionaire2.setDisabled(false);
                additionalrecipients1.setDisabled(false);
                additionalrecipients2.setDisabled(false);
                deNotifyOwner.setVisible(true);
                teamsInvolved.setDisabled(false);
                auditPeriodFrom.setDisabled(false);
                auditPeriodTo.setDisabled(false);
                testerEmail.setVisible(false);
                reviewerEmail.setDisabled(false);
                ownerSection.setVisible(false);
                isControlApplicable.setDisabled(false);

            }
            if (isTester && controlApplicabilityValue == true && controlStatus == 100000005 && designAcceptanceValue != 100000000 && designEffectivinessValue != 100000000) {
                designdocumentationdetails.setDisabled(false);
                designdocumentationevidences.setDisabled(false);
                ddTestingPerformed.setDisabled(false)
                designSteps.setDisabled(false);
                questionaire1.setDisabled(false);
                questionaire2.setDisabled(false);
                deNotifyOwner.setVisible(true);
                additionalrecipients1.setDisabled(false);
                additionalrecipients2.setDisabled(false);
            }
            if (isOwner && controlApplicabilityValue == true && controlStatus == 100000004 && questionaire1Value == 0) { // 0 : "No"
                testerEmail.setVisible(true);
                designAcceptance.setDisabled(false);
                ddAcceptanceComments.setDisabled(false);
                deNotifyOwner.setVisible(false);
            }
            if (isOwner && controlApplicabilityValue == true && controlStatus == 100000004 && questionaire1Value == 1) {
                testerEmail.setVisible(true);
                designEffectiviness.setDisabled(false);
                ddEffectivenessComments.setDisabled(false);
                deNotifyOwner.setVisible(false);
            }

            //OE steps in Design Stage
            if (formContext != undefined && formContext.ui != undefined && controlApplicabilityValue == true && designAcceptanceValue == null && designEffectivinessValue == null && questionaire1Value == true) {
                var testOfOneTab = formContext.ui.tabs.get("OperationalEffectiveness")
                testOfOneTab.setVisible(true)
                reviewerSection.setVisible(false);
                CoSection.setVisible(false);

                formContext.ui.tabs.get("OperationalEffectiveness").setFocus();
                var populationSection = testOfOneTab.sections.get("Testing Information");
                populationSection.setVisible(true);
                var testDocumentationSection = testOfOneTab.sections.get("TestDocumentation");
                testDocumentationSection.setVisible(true);

                if (isTester && (controlStatus == 100000005 || controlStatus == 100000004) && formContext.getAttribute("new_toopopulationdatasufficient").getValue() != 1 && formContext.getAttribute("new_toopopulationdata").getValue() == null) {
                    populationDetails.setDisabled(false);
                    notifyOwner.setVisible(true);
                    isCTUploadEvidence.setDisabled(false);                    
                }
                if (formContext.getAttribute("crf10_tooisctuploadevidence").getValue() === true && (controlStatus == 100000005 || controlStatus == 100000004) && isTester && formContext.getAttribute("new_toopopulationdetails").getValue() != null && formContext.getAttribute('new_testconclusion').getValue() == null) {
                    populationFileControl.setDisabled(false);
                    evidenceUrl.setDisabled(false);

                }
                if ((populationDetails.getValue() != null || formContext.getAttribute("new_toopopulationdetails").getValue() != null) && formContext.getAttribute("new_toopopulationdatasufficient").getValue() != 1 && controlStatus == 100000008 && isOwner) {
                    formContext.ui.tabs.get("DesignEffectiveness").setFocus();
                    designEffectiviness.setDisabled(false);
                    ddEffectivenessComments.setDisabled(false);
                    populationFileControl.setDisabled(false);
                    evidenceUrl.setDisabled(false);
                    notifyOwner.setVisible(false);
                    notifyTester.setVisible(true);
                }
                
                var populationFileData = formContext.getAttribute("new_toopopulationdata").getValue()

                if ((populationFileData != null || formContext.getAttribute('new_evidenceurl').getValue() != null) && formContext.getAttribute('new_testconclusion').getValue() == null && isTester) {

                    populationChoiceControl.setDisabled(false);
                    populationRemarks.setDisabled(false);
                    sampleDetails.setDisabled(false);
                    isCTUploadSample.setDisabled(false);
                    areSamplesRequired.setDisabled(false);
                }
                if (areSamplesRequiredValue == false) {
                    sampleDetails.setVisible(false);
                    isCTUploadSample.setVisible(false);
                    evidenceFileControl.setVisible(false);
                    sampleUrl.setVisible(false);
                    evidenceChoiceControl.setVisible(false);
                    evidenceRemarks.setVisible(false);
                }
                if (areSamplesRequiredValue == false && formContext.getAttribute("new_toopopulationdatasufficient").getValue() == true) {
                    formContext.getAttribute('new_tooisevidencesufficient').setValue(true)
                }
                if (formContext.getAttribute("crf10_toocttouploadsample").getValue() === true && isTester && formContext.getAttribute("new_toosampledetails").getValue() != null && formContext.getAttribute('new_testconclusion').getValue() == null) {
                    evidenceFileControl.setDisabled(false);
                    sampleUrl.setDisabled(false);
                }
                if (formContext.getAttribute('new_testconclusion').getValue() == null && isTester && formContext.getAttribute("crf10_toocttouploadsample").getValue() !== true && formContext.getAttribute('new_toopopulationdatasufficient').getValue() == 1) {
                    notifyOwner.setVisible(true);
                }
                if (formContext.getAttribute('new_testconclusion').getValue() == null && isTester && formContext.getAttribute("crf10_tooisctuploadevidence").getValue() !== true && formContext.getAttribute('new_toopopulationdatasufficient').getValue() != 1) {
                    notifyOwner.setVisible(true);
                }

                if (formContext.getAttribute('new_toopopulationdatasufficient').getValue() == 1 && formContext.getAttribute('new_testconclusion').getValue() == null && controlStatus == 100000008 && isOwner) {

                    formContext.ui.tabs.get("DesignEffectiveness").setFocus();
                    evidenceFileControl.setDisabled(false);
                    sampleUrl.setDisabled(false);
                    designEffectiviness.setDisabled(false);
                    ddEffectivenessComments.setDisabled(false);
                    notifyTester.setVisible(true);
                    notifyOwner.setVisible(false);
                }
                var evidenceFileData = formContext.getAttribute("new_sampledata").getValue();

                if (formContext.getAttribute('new_tooisevidencesufficient').getValue() == true && formContext.getAttribute('new_testconclusion').getValue() == null && isTester) {

                    evidenceChoiceControl.setDisabled(false);
                    evidenceRemarks.setDisabled(false);
                    notifyOwner.setVisible(true);
                    populationChoiceControl.setDisabled(true);
                    populationRemarks.setDisabled(true);
                    oeTestSteps.setDisabled(false);
                    oeTestingPerformed.setDisabled(false);
                    additionalDocumentation.setDisabled(false);
                    oeTestingPerformedattachment.setDisabled(false)
                }

            }
            if (isOwner)
                formContext.ui.tabs.get("DesignEffectiveness").setFocus();
        }
        if (formContext != undefined && formContext.ui != undefined && processStageName == "Operational Effectiveness") {
            notifyOwner.setVisible(false);
        }
    })
    // let currentUser = getCurrentUserEmail();

}

async function oeTab(executionContext) {

    // Initialize formContext and Comtrols, get tab visibility
    await retrieveOperation().then((retrievedUser) => {
        let currentUser = retrievedUser.toLowerCase();
        var formContext = executionContext.getFormContext();
        var processStage = formContext.data.process.getActiveStage();
        var processStageName = processStage.getName();

        if (formContext != undefined && formContext.ui != undefined && processStageName == "Operational Effectiveness") {
            let isOwner = (currentUser == (formContext.getAttribute("new_controlowneremail").getValue() != null ? formContext.getAttribute("new_controlowneremail").getValue().toLowerCase() : null));
            let isTester = (currentUser == (formContext.getAttribute("new_preparer").getValue() != null ? formContext.getAttribute("new_preparer").getValue().toLowerCase() : null))
            let isReviewer = (currentUser == (formContext.getAttribute("new_reviewerlookupemail").getValue() != null ? formContext.getAttribute("new_reviewerlookupemail").getValue().toLowerCase() : null))

            var reviewerEmail = (formContext.getAttribute("new_reviewerlookup").getValue() != null ? formContext.getAttribute("new_reviewerlookupemail").getValue().toLowerCase() : null)

            var testOfOneTab = formContext.ui.tabs.get("OperationalEffectiveness");
            var OEcontrolStatus = formContext.getAttribute('new_controlstatus').getValue();
            var isTabVisible = testOfOneTab.getVisible();
            var reviewerSection = testOfOneTab.sections.get("ReviewerSection");
            reviewerSection.setVisible(false);
            var CoSection = testOfOneTab.sections.get("OwnerSection");
            CoSection.setVisible(false);
            var populationDetails = formContext.getControl('new_toopopulationdetails');
            populationDetails.setDisabled(true)
            var populationChoiceControl = formContext.getControl('new_toopopulationdatasufficient');
            populationChoiceControl.setDisabled(true);
            var sampleDetails = formContext.getControl("new_toosampledetails");
            sampleDetails.setDisabled(true);
            var populationRemarks = formContext.getControl('new_toopopulationdataremarks');
            populationRemarks.setDisabled(true);
            var populationFileControl = formContext.getControl("new_toopopulationdata");
            populationFileControl.setDisabled(true);
            var notifyOwner = formContext.getControl("WebResource_tooNotifyOwner");
            notifyOwner.setVisible(false);
            var notifyTester = formContext.getControl("WebResource_tooNotifyTester");
            notifyTester.setVisible(false);
            var evidenceFileControl = formContext.getControl("new_sampledata");
            evidenceFileControl.setDisabled(true);
            var evidenceChoiceControl = formContext.getControl("new_tooisevidencesufficient");
            evidenceChoiceControl.setDisabled(true);
            var evidenceRemarks = formContext.getControl("new_sampledataremarks");
            evidenceRemarks.setDisabled(true);
            var controlOwnerConsent = formContext.getControl("new_toocontrolownerconsenttotestconclusion");
            controlOwnerConsent.setDisabled(true);
            var controlOwnerConsentRemarks = formContext.getControl("new_toocontrolownerremarks");
            controlOwnerConsentRemarks.setDisabled(true);
            var notifyReviewer = formContext.getControl("WebResource_tooNotifyReviewer");
            notifyReviewer.setVisible(false);
            var reviewerConsent = formContext.getControl("new_tooconsenttotestconclusion");
            reviewerConsent.setDisabled(true);
            var reviewerRemarks = formContext.getControl("new_tooreviewerremarks");
            reviewerRemarks.setDisabled(true);
            var isCTUploadEvidence = formContext.getControl("crf10_tooisctuploadevidence");
            isCTUploadEvidence.setDisabled(true);
            var evidenceUrl = formContext.getControl("new_evidenceurl");
            evidenceUrl.setDisabled(true);
            var isCTUploadSample = formContext.getControl("crf10_toocttouploadsample");
            isCTUploadSample.setDisabled(true);
            var sampleUrl = formContext.getControl("crf10_toosampleurl");
            sampleUrl.setDisabled(true);
            var oeTestSteps = formContext.getControl("new_tooteststeps");
            oeTestSteps.setDisabled(true);
            var oeTestingPerformed = formContext.getControl('new_oetestingperformed');
            oeTestingPerformed.setDisabled(true);
            var oeTestingPerformedattachment = formContext.getControl('crf10_tootestingperformedattachment');
            oeTestingPerformedattachment.setDisabled(true)
            var testConclusion = formContext.getControl("new_testconclusion");
            testConclusion.setDisabled(true);
            var additionalDocumentation = formContext.getControl('new_tooadditionaldocumentation');
            additionalDocumentation.setDisabled(true);
            var areSamplesRequired = formContext.getControl('crf10_issamplesrequired');
            areSamplesRequired.setDisabled(true);
            var areSamplesRequiredValue = formContext.getAttribute('crf10_issamplesrequired').getValue();


            if (formContext != undefined && formContext.ui != undefined && isTabVisible == true) {
                if (isTester && (OEcontrolStatus != 100000032 || OEcontrolStatus != 100000010)) {
                    notifyTester.setVisible(false)
                }
                if (isOwner && (OEcontrolStatus != 100000032 || OEcontrolStatus != 100000010)) {
                    notifyOwner.setVisible(false)
                    notifyReviewer.setVisible(false)
                }
                if (isReviewer && (OEcontrolStatus != 100000032 || OEcontrolStatus != 100000010)) {
                    notifyOwner.setVisible(false)
                    notifyReviewer.setVisible(false);
                    notifyTester.setVisible(false);
                }
                if (isTester && OEcontrolStatus == 100000006 && formContext.getAttribute("new_toopopulationdatasufficient").getValue() != 1 && formContext.getAttribute("new_toopopulationdata").getValue() == null) {
                    
                    populationDetails.setDisabled(false)
                    isCTUploadEvidence.setDisabled(false)

                }
                if (formContext.getAttribute("crf10_tooisctuploadevidence").getValue() === true && isTester && formContext.getAttribute("new_toopopulationdetails").getValue() != null) {
                    populationFileControl.setDisabled(false)
                    evidenceUrl.setDisabled(false)

                }

                if ((populationDetails.getValue() != null || formContext.getAttribute("new_toopopulationdetails").getValue() != null) && formContext.getAttribute("new_toopopulationdatasufficient").getValue() != 1 && OEcontrolStatus == 100000008 && isOwner) {
                    populationFileControl.setDisabled(false);
                    evidenceUrl.setDisabled(false);
                    notifyOwner.setVisible(false);
                    notifyTester.setVisible(true);
                }
                
                var populationFileData = formContext.getAttribute("new_toopopulationdata").getValue()
                if ((populationFileData != null || formContext.getAttribute('new_evidenceurl').getValue() != null) && isTester) {
                    populationChoiceControl.setDisabled(false)
                    populationRemarks.setDisabled(false)
                    sampleDetails.setDisabled(false);
                    isCTUploadSample.setDisabled(false)
                    areSamplesRequired.setDisabled(false)
                }
                if (areSamplesRequiredValue == false) {
                    sampleDetails.setVisible(false);
                    isCTUploadSample.setVisible(false);
                    evidenceFileControl.setVisible(false);
                    sampleUrl.setVisible(false);
                    evidenceChoiceControl.setVisible(false);
                    evidenceRemarks.setVisible(false);
                }
                if (areSamplesRequiredValue == false && formContext.getAttribute("new_toopopulationdatasufficient").getValue() == true) {
                    formContext.getAttribute('new_tooisevidencesufficient').setValue(true)
                }
                if (formContext.getAttribute("crf10_toocttouploadsample").getValue() === true && isTester && formContext.getAttribute("new_toosampledetails").getValue() != null) {
                    evidenceFileControl.setDisabled(false)
                    sampleUrl.setDisabled(false)
                }
                if (formContext.getAttribute('new_testconclusion').getValue() == null && OEcontrolStatus == 100000006 && isTester && formContext.getAttribute("crf10_toocttouploadsample").getValue() !== true && formContext.getAttribute('new_toopopulationdatasufficient').getValue() == 1) {
                    notifyOwner.setVisible(true);
                }
                if (formContext.getAttribute('new_testconclusion').getValue() == null && OEcontrolStatus == 100000006 && isTester && formContext.getAttribute("crf10_tooisctuploadevidence").getValue() !== true && formContext.getAttribute('new_toopopulationdatasufficient').getValue() != 1) {
                    notifyOwner.setVisible(true);
                }
                if (formContext.getAttribute('new_toopopulationdatasufficient').getValue() == 1 && OEcontrolStatus == 100000008 && isOwner) {
                    evidenceFileControl.setDisabled(false)
                    sampleUrl.setDisabled(true)
                    notifyTester.setVisible(true);
                }
                var evidenceFileData = formContext.getAttribute("new_sampledata").getValue();

                if (formContext.getAttribute('new_tooisevidencesufficient').getValue() == true && formContext.getAttribute('new_testconclusion').getValue() == null && isTester) {
                    evidenceChoiceControl.setDisabled(false)
                    evidenceRemarks.setDisabled(false);
                    notifyOwner.setVisible(false);
                    populationChoiceControl.setDisabled(true)
                    sampleDetails.setDisabled(true);
                    populationRemarks.setDisabled(true)
                    oeTestSteps.setDisabled(false);
                    oeTestingPerformed.setDisabled(false);
                    oeTestingPerformedattachment.setDisabled(false)
                    additionalDocumentation.setDisabled(false);
                    testConclusion.setDisabled(false)
                }
                if (formContext.getAttribute('new_tooisevidencesufficient').getValue() == 1 && OEcontrolStatus == 100000006 && isTester) {

                    CoSection.setVisible(true);

                    if (formContext.getAttribute('new_toocontrolownerconsenttotestconclusion').getValue() != 100000000 && formContext.getAttribute('new_testconclusion').getValue() !== null && reviewerEmail != null) {
                        notifyReviewer.setVisible(true);
                        reviewerSection.setVisible(true);
                    }
                    if (formContext.getAttribute('new_toocontrolownerconsenttotestconclusion').getValue() != 100000000 && formContext.getAttribute('new_testconclusion').getValue() !== null && reviewerEmail == null) { // in case reviewer field is left empty, sending notification to reviewer should be skipped
                        notifyOwner.setVisible(true);
                    }
                }
                if (formContext.getAttribute('new_tooisevidencesufficient').getValue() == 1 && isReviewer) {
                    reviewerSection.setVisible(true);
                    //testDocumentationSection.setVisible(true)
                    reviewerConsent.setDisabled(false)
                    reviewerRemarks.setDisabled(false)
                }
                if (formContext.getAttribute('new_tooisevidencesufficient').getValue() == 1 && isOwner) {
                    evidenceFileControl.setDisabled(true)
                    notifyTester.setVisible(false);
                    if (reviewerEmail != null) {
                        reviewerSection.setVisible(true);
                        //testDocumentationSection.setVisible(true)
                        reviewerConsent.setDisabled(true)
                        reviewerRemarks.setDisabled(true)
                    }
                }

                if (OEcontrolStatus == 100000008 && formContext.getAttribute('new_testconclusion').getValue() != null && isOwner) {
                    if (reviewerEmail == null) {
                        reviewerSection.setVisible(false);
                        CoSection.setVisible(true);
                        controlOwnerConsent.setDisabled(false);
                        controlOwnerConsentRemarks.setDisabled(false);
                        evidenceFileControl.setDisabled(true);
                    };
                    if (reviewerEmail != null && formContext.getAttribute('new_tooconsenttotestconclusion').getValue() == 100000000) {
                        reviewerSection.setVisible(true);
                        CoSection.setVisible(true);
                        controlOwnerConsent.setDisabled(false);
                        controlOwnerConsentRemarks.setDisabled(false);
                        evidenceFileControl.setDisabled(true);
                    }
                }
                if (formContext.getAttribute('new_tooconsenttotestconclusion').getValue() == 100000000 && isTester) {
                    evidenceChoiceControl.setDisabled(true)
                    evidenceRemarks.setDisabled(true);
                    populationChoiceControl.setDisabled(true)
                    sampleDetails.setDisabled(true);
                    populationRemarks.setDisabled(true)
                }
                if (formContext.getAttribute('new_tooisevidencesufficient').getValue() == true && formContext.getAttribute('new_tooconsenttotestconclusion').getValue() == 100000001 && isTester) {
                    oeTestSteps.setDisabled(false);
                    oeTestingPerformed.setDisabled(false);
                    oeTestingPerformedattachment.setDisabled(false)
                    additionalDocumentation.setDisabled(false);
                    testConclusion.setDisabled(false)
                }
                if (OEcontrolStatus == 100000032 || OEcontrolStatus == 100000010) {

                    notifyTester.setVisible(false)
                    notifyReviewer.setVisible(false)
                    notifyOwner.setVisible(false)
                    CoSection.setVisible(true);
                    controlOwnerConsent.setDisabled(true);
                    controlOwnerConsentRemarks.setDisabled(true);
                    if (reviewerEmail != null) {
                        reviewerSection.setVisible(true);
                        reviewerConsent.setDisabled(true)
                        reviewerRemarks.setDisabled(true)
                    }
                }

            }
        }
    })

}
