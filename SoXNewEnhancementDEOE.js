function getStage(executionContext) {
    var context = executionContext;
    var formContext = executionContext.getFormContext();
    var Stage = formContext.data.process.getActiveStage();
    var StageName = Stage.getName();

    if (StageName == "Design Effectiveness") {

        formContext.ui.tabs.get("BasicInformation").setVisible(true);
        formContext.ui.tabs.get("BasicInformation").setFocus();
        formContext.ui.tabs.get("TestingTerminated").setVisible(false);
        formContext.ui.tabs.get("DesignEffectiveness").setVisible(true);
        formContext.ui.tabs.get("OperationalEffectiveness1").setVisible(false);
        formContext.ui.tabs.get("OperationalEffectiveness2").setVisible(false);
        formContext.ui.tabs.get("YearEnd").setVisible(false);
    }

    else if (StageName == "Operational Effectiveness 1") {
        formContext.ui.tabs.get("BasicInformation").setVisible(true);
        formContext.ui.tabs.get("TestingTerminated").setVisible(false);
        formContext.ui.tabs.get("DesignEffectiveness").setVisible(true);
        formContext.ui.tabs.get("OperationalEffectiveness1").setVisible(true);
        formContext.ui.tabs.get("OperationalEffectiveness2").setVisible(false);
        formContext.ui.tabs.get("YearEnd").setVisible(false);
        oe1Tab(context);

    } else if (StageName == "Operational Effectiveness 2") {
        formContext.ui.tabs.get("BasicInformation").setVisible(true);
        formContext.ui.tabs.get("TestingTerminated").setVisible(false);
        formContext.ui.tabs.get("DesignEffectiveness").setVisible(true);
        formContext.ui.tabs.get("OperationalEffectiveness1").setVisible(true);
        formContext.ui.tabs.get("OperationalEffectiveness2").setVisible(true);
        formContext.ui.tabs.get("YearEnd").setVisible(false);
        oe1Tab(context);
        oe2Tab(context);

    } else if (StageName == "Year End") {
        formContext.ui.tabs.get("BasicInformation").setVisible(true);
        formContext.ui.tabs.get("TestingTerminated").setVisible(false);
        formContext.ui.tabs.get("DesignEffectiveness").setVisible(true);
        formContext.ui.tabs.get("OperationalEffectiveness1").setVisible(true);
        formContext.ui.tabs.get("OperationalEffectiveness2").setVisible(true);
        formContext.ui.tabs.get("YearEnd").setVisible(true);
        oe1Tab(context);
        oe2Tab(context);
        yeTab(context);
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

async function oe1Tab(executionContext) {


    // Initialize formContext and Comtrols, get tab visibility

    await retrieveOperation().then((retrievedUser) => {
        let currentUser = retrievedUser.toLowerCase();
        var formContext = executionContext.getFormContext();
        var processStage = formContext.data.process.getActiveStage();
        var processStageName = processStage.getName();

        if (formContext != undefined && formContext.ui != undefined) {
            let isOwner = (currentUser == (formContext.getAttribute("new_controlowneremail").getValue() != null ? formContext.getAttribute("new_controlowneremail").getValue().toLowerCase() : null));
            let isTester = (currentUser == (formContext.getAttribute("new_preparer").getValue() != null ? formContext.getAttribute("new_preparer").getValue().toLowerCase() : null))
            let isReviewer = (currentUser == (formContext.getAttribute("new_reviewerlookupemail").getValue() != null ? formContext.getAttribute("new_reviewerlookupemail").getValue().toLowerCase() : null))
            // Sections 
            var oe1Tab = formContext.ui.tabs.get("OperationalEffectiveness1");
            oe1Tab.setFocus();
            var OEcontrolStatus = formContext.getAttribute('new_controlstatus').getValue();
            var isTabVisible = oe1Tab.getVisible();
            /*var auditSection = oe1Tab.sections.get("AuditPeriod");
            auditSection.setVisible(false);*/
            var reviewerSection = oe1Tab.sections.get("ControlReviewerActions");
            reviewerSection.setVisible(false);
            var CoSection = oe1Tab.sections.get("ControlOwnerActions");
            CoSection.setVisible(false);
            var iucSection = oe1Tab.sections.get("IUCTesting");
            iucSection.setVisible(false);
            var ipeSection = oe1Tab.sections.get("IPETesting");
            ipeSection.setVisible(false);
            var populationSection = oe1Tab.sections.get("PopulationDetails");
            populationSection.setVisible(false);
            var testDocumentationSection = oe1Tab.sections.get("TestingDocumentation");
            testDocumentationSection.setVisible(false);
            /*var notificationSection = oe1Tab.sections.get("NotificationsHTML");
            notificationSection.setVisible(false);*/

            // Fields

            var populationDetails = formContext.getControl('new_oe1populationdetails');
            populationDetails.setDisabled(true);
            var populationChoiceControl = formContext.getControl('new_oe1ispopulationsufficient');
            populationChoiceControl.setDisabled(true);
            var populationRemarks = formContext.getControl('new_oe1popremarks');
            populationRemarks.setDisabled(true);
            var populationFileControl = formContext.getControl("new_oe1populationdata");
            populationFileControl.setDisabled(true);
            var notifyOwner = formContext.getControl("WebResource_notifyOwner");
            notifyOwner.setVisible(false);
            var notifyTester = formContext.getControl("WebResource_notifyTester");
            notifyTester.setVisible(false);
            var evidenceFileControl = formContext.getControl("new_oe1evidencedata");
            evidenceFileControl.setDisabled(true);
            var evidenceChoiceControl = formContext.getControl("new_oe1isevidencesufficient");
            evidenceChoiceControl.setDisabled(true);
            var evidenceRemarks = formContext.getControl("new_oe1evidenceremarks");
            evidenceRemarks.setDisabled(true);
            var controlOwnerConsent = formContext.getControl("new_oe1_co_doyouagreewithtestconclusion");
            controlOwnerConsent.setDisabled(true);
            var controlOwnerConsentRemarks = formContext.getControl("new_oe1coremarks");
            controlOwnerConsentRemarks.setDisabled(true);
            var oe1TestSteps = formContext.getControl("new_oe1teststeps");
            oe1TestSteps.setDisabled(true);
            var oe1TestingPerformed = formContext.getControl('new_oe1testingperformed');
            oe1TestingPerformed.setDisabled(true);
            var testConclusion = formContext.getControl("new_oe1testconclusion");
            testConclusion.setDisabled(true)
            var additionalDocumentation = formContext.getControl('new_additionaldocumentation');
            additionalDocumentation.setDisabled(true);
            var notifyReviewer = formContext.getControl("WebResource_notifyReviewer");
            notifyReviewer.setVisible(false)
            var reviewerConsent = formContext.getControl("new_oe1_cr_doyouagreewithtestconclusion");
            reviewerConsent.setDisabled(true)
            var reviewerRemarks = formContext.getControl("new_oe1crremarks");
            reviewerRemarks.setDisabled(true);


            var oe1Iuc = formContext.getControl("new_isinformationusedintheperformance");
            oe1Iuc.setDisabled(true);
            var oe1IucDescription = formContext.getControl("new_descriptionofiuc");
            oe1IucDescription.setDisabled(true);
            var oe1Source = formContext.getControl("new_source");
            oe1Source.setDisabled(true);
            var oe1ReportLogic = formContext.getControl("new_reportlogic");
            oe1ReportLogic.setDisabled(true);
            var oe1Parameters = formContext.getControl("new_parameters");
            oe1Parameters.setDisabled(true);
            var oe1Ipe = formContext.getControl("new_isipeutilizedinthetestingofthecontrol");
            oe1Ipe.setDisabled(true);
            var oe1IpeDategenerated = formContext.getControl("new_dategenerated");
            oe1IpeDategenerated.setDisabled(true);
            var oe1IpeDescription = formContext.getControl("new_descriptionofipe");
            oe1IpeDescription.setDisabled(true);
            var oe1IpeSource = formContext.getControl("new_source_ipe");
            oe1IpeSource.setDisabled(true);
            var oe1IpeReportLogic = formContext.getControl("new_reportlogic_ipe");
            oe1IpeReportLogic.setDisabled(true);
            var oe1IpeParameters = formContext.getControl("new_parameters_ipe");
            oe1IpeParameters.setDisabled(true);
            var oe1IpeConclusion = formContext.getControl("new_conclusion");
            oe1IpeConclusion.setDisabled(true);
            var sampleSizeScreenshot = formContext.getControl("new_oe1sampledefinition");
            sampleSizeScreenshot.setDisabled(true);
            var populationSize = formContext.getControl("new_populationsize");
            populationSize.setDisabled(true);
            var sampleSize = formContext.getControl("new_samplesize");
            sampleSize.setDisabled(true);
            var oeApplicability = formContext.getControl('new_testedasapartofoe1');
            oeApplicability.setDisabled(true);
            var updateDesign = formContext.getControl("WebResource_updateDesign");
            updateDesign.setVisible(false);
            var updateControlInfo = formContext.getControl("WebResource_updateControlInfo");
            updateControlInfo.setVisible(false);

            var oe1isCTUploadEvidence = formContext.getControl("crf10_oe1isctuploadevidence");
            oe1isCTUploadEvidence.setDisabled(true);
            var oe1evidenceUrl = formContext.getControl("crf10_oe1evidenceurl");
            oe1evidenceUrl.setDisabled(true);
            var oe1isCTUploadSample = formContext.getControl("crf10_oe1cttouploadsample");
            oe1isCTUploadSample.setDisabled(true);
            var oe1sampleUrl = formContext.getControl("crf10_oe1sampleurl");
            oe1sampleUrl.setDisabled(true);
            var isSoxControlApplicableValue = formContext.getAttribute("crf10_isthecontrolapplicablesox").getValue();
            var areSamplesRequired = formContext.getControl('crf10_issamplesrequiredsox');
            areSamplesRequired.setDisabled(true);
            var areSamplesRequiredValue = formContext.getAttribute('crf10_issamplesrequiredsox').getValue();
            var oe1TestingPerformedattachment = formContext.getControl('crf10_oe1testingperformedattachment');
            oe1TestingPerformedattachment.setDisabled(true);

            // For other stages
            if (formContext != undefined && formContext.ui != undefined && processStageName != "Operational Effectiveness 1") {
                reviewerSection.setVisible(true);
                CoSection.setVisible(true);
                iucSection.setVisible(true);
                ipeSection.setVisible(true);
                populationSection.setVisible(true);
                testDocumentationSection.setVisible(true);
            }


            // Check conditions & Enable Controls

            if (formContext != undefined && formContext.ui != undefined && processStageName == "Operational Effectiveness 1" && isSoxControlApplicableValue != false) {

                if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && isTester && formContext.getAttribute("new_oe1ispopulationsufficient").getValue() != 1) {
                    oeApplicability.setDisabled(false);
                }
                if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && formContext.getAttribute("new_testedasapartofoe1").getValue() == 100000000) {

                    iucSection.setVisible(true);
                    ipeSection.setVisible(true);
                    populationSection.setVisible(true);
                    testDocumentationSection.setVisible(true);

                    if (isTester && (OEcontrolStatus != 100000012 || OEcontrolStatus != 100000010)) {
                        notifyTester.setVisible(false);
                    }
                    if (isOwner && (OEcontrolStatus != 100000012 || OEcontrolStatus != 100000010)) {
                        notifyOwner.setVisible(false);
                        notifyReviewer.setVisible(false);
                    }
                    if (isReviewer && (OEcontrolStatus != 100000012 || OEcontrolStatus != 100000010)) {
                        notifyOwner.setVisible(false);
                        notifyReviewer.setVisible(false);
                        notifyTester.setVisible(false);
                    }
                    if (isTester && formContext.getAttribute("new_oe1ispopulationsufficient").getValue() != 1 && formContext.getAttribute("new_oe1populationdata").getValue() == null && OEcontrolStatus == 100000015) {
                        populationDetails.setDisabled(false);
                        formContext.getAttribute('new_oe1populationdetails').setRequiredLevel("required")
                        oe1Iuc.setDisabled(false);
                        oe1IucDescription.setDisabled(false);
                        oe1Source.setDisabled(false);
                        oe1ReportLogic.setDisabled(false);
                        oe1Parameters.setDisabled(false);
                        oe1Ipe.setDisabled(false);
                        oe1IpeDategenerated.setDisabled(false);
                        oe1IpeDescription.setDisabled(false);
                        oe1IpeSource.setDisabled(false);
                        oe1IpeReportLogic.setDisabled(false);
                        oe1IpeParameters.setDisabled(false);
                        oe1IpeConclusion.setDisabled(false);
                        notifyOwner.setVisible(true);
                        oe1isCTUploadEvidence.setDisabled(false);                        
                    }
                    if (formContext.getAttribute("crf10_oe1isctuploadevidence").getValue() === true && isTester && formContext.getAttribute("new_oe1populationdetails").getValue() != null && formContext.getAttribute('new_oe1testconclusion').getValue() == null) {
                        populationFileControl.setDisabled(false);
                        oe1evidenceUrl.setDisabled(false);
                        notifyOwner.setVisible(false)

                    }
                    if ((populationDetails.getValue() != null || formContext.getAttribute("new_oe1populationdetails").getValue() != null) && formContext.getAttribute("new_oe1ispopulationsufficient").getValue() != 1 && OEcontrolStatus == 100000013 && isOwner) {
                        populationFileControl.setDisabled(false);
                        populationFileControl.setFocus();
                        oe1evidenceUrl.setDisabled(false);
                        notifyOwner.setVisible(false);
                        notifyTester.setVisible(true);
                    }
                    
                    var populationFileData = formContext.getAttribute("new_oe1populationdata").getValue()

                    if ((populationFileData != null || formContext.getAttribute('crf10_oe1evidenceurl').getValue() != null) && OEcontrolStatus == 100000015 && formContext.getAttribute('new_oe1testconclusion').getValue() == null && isTester) {
                        sampleSizeScreenshot.setDisabled(false);
                        formContext.getAttribute('new_oe1sampledefinition').setRequiredLevel("required");
                        populationSize.setDisabled(false);
                        populationChoiceControl.setDisabled(false);
                        formContext.getAttribute('new_oe1ispopulationsufficient').setRequiredLevel("required");
                        populationRemarks.setDisabled(false);
                        sampleSize.setDisabled(false);
                        formContext.getAttribute('new_populationsize').setRequiredLevel("required");
                        formContext.getAttribute('new_samplesize').setRequiredLevel("required");
                        oe1isCTUploadSample.setDisabled(false);
                        areSamplesRequired.setDisabled(false);

                    }
                    if (areSamplesRequiredValue == false) {
                        sampleSizeScreenshot.setVisible(false);
                        formContext.getAttribute('new_oe1sampledefinition').setRequiredLevel("none")
                        oe1isCTUploadSample.setVisible(false);
                        evidenceFileControl.setVisible(false);
                        oe1sampleUrl.setVisible(false);
                        evidenceChoiceControl.setVisible(false);
                        evidenceRemarks.setVisible(false);
                    }
                    if (areSamplesRequiredValue == false && formContext.getAttribute("new_oe1ispopulationsufficient").getValue() == true) {
                        formContext.getAttribute('new_oe1isevidencesufficient').setValue(true)
                    }
                    if (formContext.getAttribute("crf10_oe1cttouploadsample").getValue() === true && isTester && formContext.getAttribute("new_oe1sampledefinition").getValue() != null && formContext.getAttribute('new_oe1testconclusion').getValue() == null) {
                        evidenceFileControl.setDisabled(false);
                        oe1sampleUrl.setDisabled(false);
                        notifyOwner.setVisible(false)
                    }
                    if (formContext.getAttribute('new_oe1testconclusion').getValue() == null && OEcontrolStatus == 100000015 && isTester && formContext.getAttribute("crf10_oe1cttouploadsample").getValue() !== true && formContext.getAttribute('new_oe1ispopulationsufficient').getValue() == 1) {
                        notifyOwner.setVisible(true);
                    }
                    if (formContext.getAttribute('new_oe1testconclusion').getValue() == null && OEcontrolStatus == 100000015 && isTester && formContext.getAttribute("crf10_oe1isctuploadevidence").getValue() !== true && formContext.getAttribute('new_oe1ispopulationsufficient').getValue() != 1) {
                        notifyOwner.setVisible(true);
                    }

                    if (formContext.getAttribute('new_oe1ispopulationsufficient').getValue() == 1 && OEcontrolStatus == 100000013 && formContext.getAttribute('new_oe1testconclusion').getValue() == null && isOwner) {
                        evidenceFileControl.setDisabled(false);
                        notifyTester.setVisible(true);
                        notifyOwner.setVisible(false);
                    }
                    var evidenceFileData = formContext.getAttribute("new_oe1evidencedata").getValue();

                    if ((evidenceFileData != null || formContext.getAttribute('crf10_oe1sampleurl').getValue() != null || areSamplesRequiredValue == false) && OEcontrolStatus == 100000015 && isTester) {
                        oe1isCTUploadSample.setDisabled(true);
                        evidenceChoiceControl.setDisabled(false);
                        evidenceRemarks.setDisabled(false);
                        notifyOwner.setVisible(true);
                        populationChoiceControl.setDisabled(true);
                        populationRemarks.setDisabled(true);
                        oe1TestSteps.setDisabled(false);
                        oe1TestingPerformed.setDisabled(false);
                        additionalDocumentation.setDisabled(false);
                        testConclusion.setDisabled(false)
                        oe1TestingPerformedattachment.setDisabled(false);

                    }
                    if (formContext.getAttribute('new_oe1isevidencesufficient').getValue() == 1 && isTester) {
                        //testDocumentationSection.setVisible(true);
                        reviewerSection.setVisible(true);
                        CoSection.setVisible(true);
                        notifyOwner.setVisible(false);
                        if (formContext.getAttribute('new_oe1testconclusion').getValue() != null && OEcontrolStatus == 100000015 && formContext.getAttribute('new_oe1_cr_doyouagreewithtestconclusion').getValue() != 100000000 && isTester) {
                            notifyReviewer.setVisible(true);
                        }
                    }
                    if (formContext.getAttribute('new_oe1isevidencesufficient').getValue() == 1 && isReviewer) {
                        reviewerSection.setVisible(true);
                        if (OEcontrolStatus == 100000014) {
                            //testDocumentationSection.setVisible(true)
                            reviewerConsent.setDisabled(false);
                            reviewerRemarks.setDisabled(false);
                        }
                    }
                    if (formContext.getAttribute('new_oe1isevidencesufficient').getValue() == 1 && isOwner) {
                        reviewerSection.setVisible(true);
                        //testDocumentationSection.setVisible(true);
                        reviewerConsent.setDisabled(true);
                        reviewerRemarks.setDisabled(true);
                        evidenceFileControl.setDisabled(true);
                        notifyTester.setVisible(false);
                    }

                    if (formContext.getAttribute('new_oe1_cr_doyouagreewithtestconclusion').getValue() == 100000000 && formContext.getAttribute('new_oe1testconclusion').getValue() != null && isOwner) {
                        reviewerSection.setVisible(true);
                        //testDocumentationSection.setVisible(true);
                        CoSection.setVisible(true);
                        controlOwnerConsent.setDisabled(false);
                        controlOwnerConsentRemarks.setDisabled(false);
                        evidenceFileControl.setDisabled(true);

                    }
                    if (formContext.getAttribute('new_oe1_cr_doyouagreewithtestconclusion').getValue() != null && isTester) {
                        evidenceChoiceControl.setDisabled(true);
                        evidenceRemarks.setDisabled(true);
                        populationChoiceControl.setDisabled(true);
                        populationRemarks.setDisabled(true);
                    }
                    if (formContext.getAttribute('new_oe1_cr_doyouagreewithtestconclusion').getValue() == 100000000 && isTester) {
                        oe1TestSteps.setDisabled(true);
                        oe1TestingPerformed.setDisabled(true);
                        additionalDocumentation.setDisabled(true);
                        testConclusion.setDisabled(true)
                        oe1TestingPerformedattachment.setDisabled(true);
                    }
                    if (OEcontrolStatus == 100000012 || OEcontrolStatus == 100000010) {

                        notifyTester.setVisible(false);
                        notifyReviewer.setVisible(false);
                        notifyOwner.setVisible(false);
                        reviewerConsent.setDisabled(true);
                        reviewerRemarks.setDisabled(true);
                        oe1TestSteps.setDisabled(true);
                        oe1TestingPerformed.setDisabled(true);
                        testConclusion.setDisabled(true);
                        reviewerSection.setVisible(true);
                        testDocumentationSection.setVisible(true);
                        CoSection.setVisible(true);
                        controlOwnerConsent.setDisabled(true);
                        controlOwnerConsentRemarks.setDisabled(true);

                    }

                }
            }
        }
    })

}

async function designEffectivenessTab(executionContext) {
    // Initialize formContext and Comtrols, get tab visibility
    var formContext = executionContext.getFormContext();
    var processStage = formContext.data.process.getActiveStage();
    var processStageName = processStage.getName()
    await retrieveOperation().then((retrievedUser) => {
        let currentUser = retrievedUser.toLowerCase();
        var dETab = formContext.ui.tabs.get("DesignEffectiveness");
        var deNotifyOwner = formContext.getControl("WebResource_deNotifyOwner");
        deNotifyOwner.setVisible(false);
        var ownerSection = dETab.sections.get("COAction");
        let hasTesterRole = hasCurrentUserRole("MICS_ZonalOwnerRole");
        let isOwner = (currentUser == (formContext.getAttribute("new_controlowneremail").getValue() != null ? formContext.getAttribute("new_controlowneremail").getValue().toLowerCase() : null));
        let isTester = (currentUser == (formContext.getAttribute("new_preparer").getValue() != null ? formContext.getAttribute("new_preparer").getValue().toLowerCase() : null))
        var controlStatus = formContext.getAttribute('new_controlstatus').getValue();
        var typeOfControl = formContext.getAttribute('new_typeofcontrol').getValue();
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
        var testerEmail = formContext.getControl("new_preparer");
        testerEmail.setDisabled(true);
        var reviewerEmail = formContext.getControl("new_reviewerlookup");
        reviewerEmail.setDisabled(true);
        var auditPeriodFrom = formContext.getControl("new_auditperiodfrom");
        auditPeriodFrom.setDisabled(true);
        var auditPeriodTo = formContext.getControl("new_auditperiodto");
        auditPeriodTo.setDisabled(true);
        var SoXApplicableRationale = formContext.getControl("crf10_rationale");
        SoXApplicableRationale.setDisabled(true);
        var isSoxControlApplicable = formContext.getControl("crf10_isthecontrolapplicablesox");
        isSoxControlApplicable.setDisabled(true);
        var isSoxControlApplicableValue = formContext.getAttribute("crf10_isthecontrolapplicablesox").getValue()

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

        // IUC/IPE Fields
        var deIuc = formContext.getControl("crf10_de_isinformationusedintheperformance");
        deIuc.setDisabled(true);
        var deIucDescription = formContext.getControl("crf10_de_descriptionofiuc");
        deIucDescription.setDisabled(true);
        var deSource = formContext.getControl("crf10_de_source");
        deSource.setDisabled(true);
        var deReportLogic = formContext.getControl("crf10_de_reportlogic");
        deReportLogic.setDisabled(true);
        var deParameters = formContext.getControl("crf10_de_iuc_parameters");
        deParameters.setDisabled(true);
        var deIpe = formContext.getControl("crf10_de_isipeutilizedinthetestingofthecontrol");
        deIpe.setDisabled(true);
        var deIpeDategenerated = formContext.getControl("crf10_de_dategenerated");
        deIpeDategenerated.setDisabled(true);
        var deIpeDescription = formContext.getControl("crf10_de_descriptionofipe");
        deIpeDescription.setDisabled(true);
        var deIpeSource = formContext.getControl("crf10_de_ipe_source");
        deIpeSource.setDisabled(true);
        var deIpeReportLogic = formContext.getControl("crf10_de_ipe_reportlogic");
        deIpeReportLogic.setDisabled(true);
        var deIpeParameters = formContext.getControl("crf10_de_ipe_parameters");
        deIpeParameters.setDisabled(true);
        var deIpeConclusion = formContext.getControl("crf10_de_ipe_conclusion");
        deIpeConclusion.setDisabled(true);

        // information fields   
        var headCoordinator = formContext.getControl("new_headcoordinator");
        headCoordinator.setDisabled(true)
        var processOwner = formContext.getControl("new_processowner");
        processOwner.setDisabled(true)

        var whoExecutesTheActivityFunction = formContext.getControl("new_whoexecutestheactivityfunction");
        whoExecutesTheActivityFunction.setDisabled(true)
        var whatActionDoesThisPersonDo = formContext.getControl("new_whatactiondoesthispersondo");
        whatActionDoesThisPersonDo.setDisabled(true)
        var whatIsTheEvidenceQuestion = formContext.getControl("new_whatistheevidencethatthecontrolhasbeenper");
        whatIsTheEvidenceQuestion.setDisabled(true)
        var personRelevant = formContext.getControl("new_whyisthatpersonpositionrelevanttocontrol");
        personRelevant.setDisabled(true)
        var prerequisites = formContext.getControl("new_whataretheprerequisitestoperformcontrol");
        prerequisites.setDisabled(true)
        var frequency = formContext.getControl("new_frequency");
        frequency.setDisabled(true)
        var teamsInvolved = formContext.getControl("new_teamsinvolved");
        teamsInvolved.setDisabled(true);
        var itTeamsInvolved = formContext.getControl("new_itsystemsinvolved");
        itTeamsInvolved.setDisabled(true)
        var ddTestingPerformed = formContext.getControl("new_ddtestingperformed");
        ddTestingPerformed.setDisabled(true);
        var updateDesign = formContext.getControl("WebResource_updateDesign");
        updateDesign.setVisible(false);
        var updateControlInfo = formContext.getControl("WebResource_updateControlInfo");
        updateControlInfo.setVisible(false);

        // OE Fields

        var populationDetails = formContext.getControl('new_oe1populationdetails');
        populationDetails.setDisabled(true);
        var populationChoiceControl = formContext.getControl('new_oe1ispopulationsufficient');
        populationChoiceControl.setDisabled(true);
        var populationRemarks = formContext.getControl('new_oe1popremarks');
        populationRemarks.setDisabled(true);
        var populationFileControl = formContext.getControl("new_oe1populationdata");
        populationFileControl.setDisabled(true);
        var notifyOwner = formContext.getControl("WebResource_notifyOwner");
        notifyOwner.setVisible(false);
        var notifyTester = formContext.getControl("WebResource_notifyTester");
        notifyTester.setVisible(false);
        var evidenceFileControl = formContext.getControl("new_oe1evidencedata");
        evidenceFileControl.setDisabled(true);
        var evidenceChoiceControl = formContext.getControl("new_oe1isevidencesufficient");
        evidenceChoiceControl.setDisabled(true);
        var evidenceRemarks = formContext.getControl("new_oe1evidenceremarks");
        evidenceRemarks.setDisabled(true);
        var controlOwnerConsent = formContext.getControl("new_oe1_co_doyouagreewithtestconclusion");
        controlOwnerConsent.setDisabled(true);
        var controlOwnerConsentRemarks = formContext.getControl("new_oe1coremarks");
        controlOwnerConsentRemarks.setDisabled(true);
        var oe1TestSteps = formContext.getControl("new_oe1teststeps");
        oe1TestSteps.setDisabled(true);
        var oe1TestingPerformed = formContext.getControl('new_oe1testingperformed');
        oe1TestingPerformed.setDisabled(true);
        var testConclusion = formContext.getControl("new_oe1testconclusion");
        testConclusion.setDisabled(true)
        var additionalDocumentation = formContext.getControl('new_additionaldocumentation');
        additionalDocumentation.setDisabled(true);
        var notifyReviewer = formContext.getControl("WebResource_notifyReviewer");
        notifyReviewer.setVisible(false)
        var reviewerConsent = formContext.getControl("new_oe1_cr_doyouagreewithtestconclusion");
        reviewerConsent.setDisabled(true)
        var reviewerRemarks = formContext.getControl("new_oe1crremarks");
        reviewerRemarks.setDisabled(true);


        var oe1Iuc = formContext.getControl("new_isinformationusedintheperformance");
        oe1Iuc.setDisabled(true);
        var oe1IucDescription = formContext.getControl("new_descriptionofiuc");
        oe1IucDescription.setDisabled(true);
        var oe1Source = formContext.getControl("new_source");
        oe1Source.setDisabled(true);
        var oe1ReportLogic = formContext.getControl("new_reportlogic");
        oe1ReportLogic.setDisabled(true);
        var oe1Parameters = formContext.getControl("new_parameters");
        oe1Parameters.setDisabled(true);
        var oe1Ipe = formContext.getControl("new_isipeutilizedinthetestingofthecontrol");
        oe1Ipe.setDisabled(true);
        var oe1IpeDategenerated = formContext.getControl("new_dategenerated");
        oe1IpeDategenerated.setDisabled(true);
        var oe1IpeDescription = formContext.getControl("new_descriptionofipe");
        oe1IpeDescription.setDisabled(true);
        var oe1IpeSource = formContext.getControl("new_source_ipe");
        oe1IpeSource.setDisabled(true);
        var oe1IpeReportLogic = formContext.getControl("new_reportlogic_ipe");
        oe1IpeReportLogic.setDisabled(true);
        var oe1IpeParameters = formContext.getControl("new_parameters_ipe");
        oe1IpeParameters.setDisabled(true);
        var oe1IpeConclusion = formContext.getControl("new_conclusion");
        oe1IpeConclusion.setDisabled(true);
        var sampleSizeScreenshot = formContext.getControl("new_oe1sampledefinition");
        sampleSizeScreenshot.setDisabled(true);
        var populationSize = formContext.getControl("new_populationsize");
        populationSize.setDisabled(true);
        var sampleSize = formContext.getControl("new_samplesize");
        sampleSize.setDisabled(true);
        var oeApplicability = formContext.getControl('new_testedasapartofoe1');
        oeApplicability.setDisabled(true);
        var updateDesign = formContext.getControl("WebResource_updateDesign");
        updateDesign.setVisible(false);
        var updateControlInfo = formContext.getControl("WebResource_updateControlInfo");
        updateControlInfo.setVisible(false);

        var oe1isCTUploadEvidence = formContext.getControl("crf10_oe1isctuploadevidence");
        oe1isCTUploadEvidence.setDisabled(true);
        var oe1evidenceUrl = formContext.getControl("crf10_oe1evidenceurl");
        oe1evidenceUrl.setDisabled(true);
        var oe1isCTUploadSample = formContext.getControl("crf10_oe1cttouploadsample");
        oe1isCTUploadSample.setDisabled(true);
        var oe1sampleUrl = formContext.getControl("crf10_oe1sampleurl");
        oe1sampleUrl.setDisabled(true);
        var areSamplesRequired = formContext.getControl('crf10_issamplesrequiredsox');
        areSamplesRequired.setDisabled(true);
        var areSamplesRequiredValue = formContext.getAttribute('crf10_issamplesrequiredsox').getValue();
        var oe1TestingPerformedattachment = formContext.getControl('crf10_oe1testingperformedattachment');
        oe1TestingPerformedattachment.setDisabled(true);

        // Check conditions & Enable Controls
        if (formContext != undefined && formContext.ui != undefined && processStageName == "Design Effectiveness" && isSoxControlApplicableValue != false) {

            if (hasTesterRole && controlStatus == 100000011) {
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
                headCoordinator.setDisabled(false);
                processOwner.setDisabled(false);
                whoExecutesTheActivityFunction.setDisabled(false)
                whatActionDoesThisPersonDo.setDisabled(false)
                whatIsTheEvidenceQuestion.setDisabled(false)
                personRelevant.setDisabled(false)
                prerequisites.setDisabled(false)
                frequency.setDisabled(false)
                itTeamsInvolved.setDisabled(false)
                isSoxControlApplicable.setDisabled(false);
                SoXApplicableRationale.setDisabled(false);
                deIuc.setDisabled(false);

                deIucDescription.setDisabled(false);

                deSource.setDisabled(false);

                deReportLogic.setDisabled(false);

                deParameters.setDisabled(false);

                deIpe.setDisabled(false);

                deIpeDategenerated.setDisabled(false);

                deIpeDescription.setDisabled(false);

                deIpeSource.setDisabled(false);

                deIpeReportLogic.setDisabled(false);

                deIpeParameters.setDisabled(false);

                deIpeConclusion.setDisabled(false);
            }

            if (isTester && controlStatus == 100000005 && designAcceptanceValue != 100000000 && designEffectivinessValue != 100000000) {
                designdocumentationdetails.setDisabled(false);
                formContext.getAttribute('new_designdocumentation').setRequiredLevel("required")
                designdocumentationevidences.setDisabled(false);
                formContext.getAttribute('new_designevidences').setRequiredLevel("required")
                ddTestingPerformed.setDisabled(false);
                designSteps.setDisabled(false);
                questionaire1.setDisabled(false);
                questionaire2.setDisabled(false);
                deNotifyOwner.setVisible(true);
                additionalrecipients1.setDisabled(false);
                additionalrecipients2.setDisabled(false);
                whoExecutesTheActivityFunction.setDisabled(false)
                whatActionDoesThisPersonDo.setDisabled(false)
                whatIsTheEvidenceQuestion.setDisabled(false)
                personRelevant.setDisabled(false)
                prerequisites.setDisabled(false)
                frequency.setDisabled(false)
                itTeamsInvolved.setDisabled(false)

            }
            if (isOwner && questionaire1Value == 0) { // (0: No, 1: Yes)
                testerEmail.setVisible(true);
                designAcceptance.setDisabled(false);
                ddAcceptanceComments.setDisabled(false);
                deNotifyOwner.setVisible(false);
            }
            // isOwner && controlStatus == 100000004 && questionaire1Value == 1
            if (isOwner && questionaire1Value == 1) {
                testerEmail.setVisible(true);
                designEffectiviness.setDisabled(false);
                ddEffectivenessComments.setDisabled(false);
                deNotifyOwner.setVisible(false);
            }

            //OE steps in Design Stage
            if (formContext != undefined && formContext.ui != undefined && designAcceptanceValue == null && designEffectivinessValue == null && questionaire1Value == true) {
                var oe1Tab = formContext.ui.tabs.get("OperationalEffectiveness1")
                oe1Tab.setVisible(true)

                var reviewerSection = oe1Tab.sections.get("ControlReviewerActions");
                reviewerSection.setVisible(false);
                var CoSection = oe1Tab.sections.get("ControlOwnerActions");
                CoSection.setVisible(false);

                if (isTester && formContext.getAttribute("new_oe1ispopulationsufficient").getValue() != 1 && formContext.getAttribute("new_oe1populationdata").getValue() == null) {
                    oeApplicability.setDisabled(false);
                }


                if (formContext.getAttribute("new_testedasapartofoe1").getValue() == 100000000) {
                    formContext.ui.tabs.get("OperationalEffectiveness1").setFocus();
                    var iucSection = oe1Tab.sections.get("IUCTesting");
                    iucSection.setVisible(true);
                    var ipeSection = oe1Tab.sections.get("IPETesting");
                    ipeSection.setVisible(true);
                    var populationSection = oe1Tab.sections.get("PopulationDetails");
                    populationSection.setVisible(true);
                    var testDocumentationSection = oe1Tab.sections.get("TestingDocumentation");
                    testDocumentationSection.setVisible(true);

                    if (isTester && formContext.getAttribute("new_oe1ispopulationsufficient").getValue() != 1 && formContext.getAttribute("new_oe1populationdata").getValue() == null) {
                        populationDetails.setDisabled(false);
                        formContext.getAttribute('new_oe1populationdetails').setRequiredLevel("required")
                        oe1Iuc.setDisabled(false);
                        oe1IucDescription.setDisabled(false);
                        oe1Source.setDisabled(false);
                        oe1ReportLogic.setDisabled(false);
                        oe1Parameters.setDisabled(false);
                        oe1Ipe.setDisabled(false);
                        oe1IpeDategenerated.setDisabled(false);
                        oe1IpeDescription.setDisabled(false);
                        oe1IpeSource.setDisabled(false);
                        oe1IpeReportLogic.setDisabled(false);
                        oe1IpeParameters.setDisabled(false);
                        oe1IpeConclusion.setDisabled(false);
                        notifyOwner.setVisible(true);
                        oe1isCTUploadEvidence.setDisabled(false);
                        
                    }
                    if (formContext.getAttribute("crf10_oe1isctuploadevidence").getValue() === true && isTester && formContext.getAttribute("new_oe1populationdetails").getValue() != null && formContext.getAttribute('new_oe1testconclusion').getValue() == null) {
                        populationFileControl.setDisabled(false);
                        oe1evidenceUrl.setDisabled(false);
                        notifyOwner.setVisible(false);
                    }
                    if ((populationDetails.getValue() != null || formContext.getAttribute("new_oe1populationdetails").getValue() != null) && formContext.getAttribute("new_oe1ispopulationsufficient").getValue() != 1 && controlStatus == 100000013 && isOwner) {
                        formContext.ui.tabs.get("DesignEffectiveness").setFocus();
                        designEffectiviness.setDisabled(false);
                        ddEffectivenessComments.setDisabled(false);
                        populationFileControl.setDisabled(false);
                        oe1evidenceUrl.setDisabled(false);
                        notifyOwner.setVisible(false);
                        notifyTester.setVisible(true);
                    }
                    
                    var populationFileData = formContext.getAttribute("new_oe1populationdata").getValue()

                    if ((populationFileData != null || formContext.getAttribute('crf10_oe1evidenceurl').getValue() != null) && formContext.getAttribute('new_oe1testconclusion').getValue() == null && isTester) {
                        areSamplesRequired.setDisabled(false);
                        sampleSizeScreenshot.setDisabled(false);
                        formContext.getAttribute('new_oe1sampledefinition').setRequiredLevel("required")
                        populationSize.setDisabled(false);
                        populationChoiceControl.setDisabled(false);
                        formContext.getAttribute('new_oe1ispopulationsufficient').setRequiredLevel("required")
                        populationRemarks.setDisabled(false);
                        sampleSize.setDisabled(false);
                        oe1isCTUploadSample.setDisabled(false);
                    }
                    if (areSamplesRequiredValue == false) {
                        formContext.getAttribute('new_oe1sampledefinition').setRequiredLevel("none")
                        sampleSizeScreenshot.setVisible(false);
                        oe1isCTUploadSample.setVisible(false);
                        evidenceFileControl.setVisible(false);
                        oe1sampleUrl.setVisible(false);
                        evidenceChoiceControl.setVisible(false);
                        evidenceRemarks.setVisible(false);
                    }
                    if (areSamplesRequiredValue == false && formContext.getAttribute("new_oe1ispopulationsufficient").getValue() == true) {
                        formContext.getAttribute('new_oe1isevidencesufficient').setValue(true)
                    }
                    if (formContext.getAttribute("crf10_oe1cttouploadsample").getValue() === true && isTester && formContext.getAttribute("new_oe1sampledefinition").getValue() != null && formContext.getAttribute('new_oe1testconclusion').getValue() == null) {
                        evidenceFileControl.setDisabled(false);
                        oe1sampleUrl.setDisabled(false);
                        notifyOwner.setVisible(false);
                    }
                    if (formContext.getAttribute('new_oe1testconclusion').getValue() == null && isTester && formContext.getAttribute("crf10_oe1cttouploadsample").getValue() !== true && formContext.getAttribute('new_oe1ispopulationsufficient').getValue() == 1) {
                        notifyOwner.setVisible(true);
                    }
                    if (formContext.getAttribute('new_oe1testconclusion').getValue() == null && isTester && formContext.getAttribute("crf10_oe1isctuploadevidence").getValue() !== true && formContext.getAttribute('new_oe1ispopulationsufficient').getValue() != 1) {
                        notifyOwner.setVisible(true);
                    }

                    if (formContext.getAttribute('new_oe1ispopulationsufficient').getValue() == 1 && formContext.getAttribute('new_oe1testconclusion').getValue() == null && controlStatus == 100000013 && isOwner) {

                        formContext.ui.tabs.get("DesignEffectiveness").setFocus();
                        evidenceFileControl.setDisabled(false);
                        oe1sampleUrl.setDisabled(false);
                        designEffectiviness.setDisabled(false);
                        ddEffectivenessComments.setDisabled(false);
                        notifyTester.setVisible(true);
                        notifyOwner.setVisible(false);
                    }
                    var evidenceFileData = formContext.getAttribute("new_oe1evidencedata").getValue();

                    if ((evidenceFileData != null || formContext.getAttribute('crf10_oe1sampleurl').getValue() != null || areSamplesRequiredValue == false) && formContext.getAttribute('new_oe1testconclusion').getValue() == null && isTester) {
                        oe1isCTUploadSample.setDisabled(true);
                        evidenceChoiceControl.setDisabled(false);
                        evidenceRemarks.setDisabled(false);
                        notifyOwner.setVisible(true);
                        populationChoiceControl.setDisabled(true);
                        populationRemarks.setDisabled(true);
                        oe1TestSteps.setDisabled(false);
                        oe1TestingPerformed.setDisabled(false);
                        additionalDocumentation.setDisabled(false);
                        oe1TestingPerformedattachment.setDisabled(false);

                    }
                    if (isOwner)
                        formContext.ui.tabs.get("DesignEffectiveness").setFocus();
                }
            }


        }
        if (formContext != undefined && formContext.ui != undefined && processStageName == "Operational Effectiveness 1" && isSoxControlApplicableValue != false) {
            deNotifyOwner.setVisible(false);
        }
    })

}

async function oe2Tab(executionContext) {
    // Initialize formContext and Comtrols, get tab visibility

    await retrieveOperation().then((retrievedUser) => {
        let currentUser = retrievedUser.toLowerCase();
        var formContext = executionContext.getFormContext();
        var processStage = formContext.data.process.getActiveStage();
        var processStageName = processStage.getName();

        if (formContext != undefined && formContext.ui != undefined) {
            let isOwner = (currentUser == (formContext.getAttribute("new_controlowneremail").getValue() != null ? formContext.getAttribute("new_controlowneremail").getValue().toLowerCase() : null));
            let isTester = (currentUser == (formContext.getAttribute("new_preparer").getValue() != null ? formContext.getAttribute("new_preparer").getValue().toLowerCase() : null))
            let isReviewer = (currentUser == (formContext.getAttribute("new_oe2reviewerlookupemail").getValue() != null ? formContext.getAttribute("new_oe2reviewerlookupemail").getValue().toLowerCase() : null))

            // Sections
            var oe2Tab = formContext.ui.tabs.get("OperationalEffectiveness2");
            oe2Tab.setFocus();
            var OEcontrolStatus = formContext.getAttribute('new_controlstatus').getValue();
            var isTabVisible = oe2Tab.getVisible();
            /*var auditSection = oe2Tab.sections.get("AuditPeriod");
            auditSection.setVisible(false);*/
            var oe2reviewerSection = oe2Tab.sections.get("OE2ControlReviewerActions");
            oe2reviewerSection.setVisible(false);
            var oe2CoSection = oe2Tab.sections.get("OE2ControlOwnerActions");
            oe2CoSection.setVisible(false);
            var oe2iucSection = oe2Tab.sections.get("OE2IUCTesting");
            oe2iucSection.setVisible(false);
            var oe2ipeSection = oe2Tab.sections.get("OE2IPETesting");
            oe2ipeSection.setVisible(false);
            var oe2populationSection = oe2Tab.sections.get("OE2PopulationDetails");
            oe2populationSection.setVisible(false);
            var oe2testingDocSection = oe2Tab.sections.get("OE2TestingDocumentation");
            oe2testingDocSection.setVisible(false);
            var oe2notificationSection = oe2Tab.sections.get("OE2Notifications");
            oe2notificationSection.setVisible(false);
            var reviewerSelectionSection = oe2Tab.sections.get("OE2Reviewer");
            reviewerSelectionSection.setVisible(false);
            var oe2confirmationSection = oe2Tab.sections.get("OE2ConfirmationSection");
            oe2confirmationSection.setVisible(false);

            // Fields

            var populationDetails = formContext.getControl('new_oe2populationdetails');
            populationDetails.setDisabled(true);
            var populationChoiceControl = formContext.getControl('new_oe2ispopulationsufficient');
            populationChoiceControl.setDisabled(true);
            var populationRemarks = formContext.getControl('new_oe2popremarks');
            populationRemarks.setDisabled(true);
            var populationFileControl = formContext.getControl("new_oe2populationdata");
            populationFileControl.setDisabled(true);
            var notifyOwner = formContext.getControl("WebResource_oe2NotifyOwner");
            notifyOwner.setVisible(false);
            var notifyTester = formContext.getControl("WebResource_oe2NotifyTester");
            notifyTester.setVisible(false);
            var updateDesign = formContext.getControl("WebResource_updateDesign");
            updateDesign.setVisible(false);
            var updateControlInfo = formContext.getControl("WebResource_updateControlInfo");
            updateControlInfo.setVisible(false);
            var evidenceFileControl = formContext.getControl("new_oe2evidencedata");
            evidenceFileControl.setDisabled(true);
            var evidenceChoiceControl = formContext.getControl("new_oe2isevidencesufficient");
            evidenceChoiceControl.setDisabled(true);
            var evidenceRemarks = formContext.getControl("new_oe2evidenceremarks");
            evidenceRemarks.setDisabled(true);
            var controlOwnerConsent = formContext.getControl("new_oe2_co_doyouagreewithtestconclusion");
            controlOwnerConsent.setDisabled(true);
            var controlOwnerConsentRemarks = formContext.getControl("new_oe2coremarks");
            controlOwnerConsentRemarks.setDisabled(true);
            var oeTestSteps = formContext.getControl("new_oe2_teststeps");
            //oeTestSteps.setDisabled(true);
            var testConclusion = formContext.getControl("new_oe2_testconclusion");
            //testConclusion.setDisabled(true)
            var additionalDocumentation = formContext.getControl('new_oe2_additionaldocumentation');
            //additionalDocumentation.setDisabled(true);
            var oe2TestingPerformed = formContext.getControl('new_oe2testingperformed');
            //oe2TestingPerformed.setDisabled(true);
            var notifyReviewer = formContext.getControl("WebResource_oe2NotifyReviewer");
            notifyReviewer.setVisible(false)
            var reviewerConsent = formContext.getControl("new_oe2_doyouagreewithtestconclusion");
            reviewerConsent.setDisabled(true)
            var reviewerRemarks = formContext.getControl("new_oe2crremarks");
            reviewerRemarks.setDisabled(true);

            var oe2Iuc = formContext.getControl("new_oe2_isinformationusedintheperformance");
            oe2Iuc.setDisabled(true);
            var oe2IucDescription = formContext.getControl("new_oe2_descriptionofiuc");
            oe2IucDescription.setDisabled(true);
            var oe2Source = formContext.getControl("new_oe2_iuc_source");
            oe2Source.setDisabled(true);
            var oe2ReportLogic = formContext.getControl("new_oe2_iuc_reportlogic");
            oe2ReportLogic.setDisabled(true);
            var oe2Parameters = formContext.getControl("new_oe2_iuc_parameters");
            oe2Parameters.setDisabled(true);
            var oe2Ipe = formContext.getControl("new_oe2_isipeutilizedinthetestingofthecontrol");
            oe2Ipe.setDisabled(true);
            var oe2IpeDategenerated = formContext.getControl("new_oe2_dategenerated");
            oe2IpeDategenerated.setDisabled(true);
            var oe2IpeDescription = formContext.getControl("new_oe2ipedescription");
            oe2IpeDescription.setDisabled(true);
            var oe2IpeSource = formContext.getControl("new_oe2_source");
            oe2IpeSource.setDisabled(true);
            var oe2IpeReportLogic = formContext.getControl("new_oe2_reportlogic");
            oe2IpeReportLogic.setDisabled(true);
            var oe2IpeParameters = formContext.getControl("new_oe2_parameters");
            oe2IpeParameters.setDisabled(true);
            var oe2TestConclusion = formContext.getControl("new_oe2_conclusion");
            oe2TestConclusion.setDisabled(true);
            var oe2AuditPeriodFrom = formContext.getControl("new_oe1auditperiodfrom");
            oe2AuditPeriodFrom.setDisabled(true);
            var oe2AuditPeriodTo = formContext.getControl("new_oe1auditperiodto");
            oe2AuditPeriodTo.setDisabled(true);
            var sampleSizeScreenshot = formContext.getControl("new_oe2sampledefinition");
            sampleSizeScreenshot.setDisabled(true);
            var populationSize = formContext.getControl("new_oe2_populationsize");
            populationSize.setDisabled(true);
            var sampleSize = formContext.getControl("new_oe2_samplesize");
            sampleSize.setDisabled(true);
            var oe2Applicability = formContext.getControl('new_testedasapartofoe2');
            oe2Applicability.setDisabled(true);
            var agreeWithExistingDesign = formContext.getControl('new_agreewithexistingdesign');
            agreeWithExistingDesign.setDisabled(true);
            var agreeWithControlDescription = formContext.getControl('new_oe2agreewithexistingcontroldescription');
            agreeWithControlDescription.setDisabled(true);
            var reviewerLookup = formContext.getControl('new_oe2reviewerlookupuser');
            reviewerLookup.setDisabled(true);

            var oe2isCTUploadEvidence = formContext.getControl("crf10_oe2isctuploadevidence");
            oe2isCTUploadEvidence.setDisabled(true);
            var oe2evidenceUrl = formContext.getControl("crf10_oe2evidenceurl");
            oe2evidenceUrl.setDisabled(true);
            var oe2isCTUploadSample = formContext.getControl("crf10_oe2cttouploadsample");
            oe2isCTUploadSample.setDisabled(true);
            var oe2sampleUrl = formContext.getControl("crf10_oe2sampleurl");
            oe2sampleUrl.setDisabled(true);
            var areSamplesRequired = formContext.getControl('crf10_issamplesrequiredoe2');
            areSamplesRequired.setDisabled(true);
            var areSamplesRequiredValue = formContext.getAttribute('crf10_issamplesrequiredoe2').getValue();
            var oe2TestingPerformedattachment = formContext.getControl('crf10_oe2testingperformedattachment');
            oe2TestingPerformedattachment.setDisabled(true);


            // For other stages
            if (formContext != undefined && formContext.ui != undefined && processStageName != "Operational Effectiveness 2") {
                oe2reviewerSection.setVisible(true);
                oe2CoSection.setVisible(true);
                oe2iucSection.setVisible(true);
                oe2ipeSection.setVisible(true);
                oe2populationSection.setVisible(true);
                oe2testingDocSection.setVisible(true);
                reviewerSelectionSection.setVisible(true);
                oe2confirmationSection.setVisible(true);
            }

            // Check conditions & Enable Controls
            if (formContext != undefined && formContext.ui != undefined && processStageName == "Operational Effectiveness 2") {

                if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && isTester && formContext.getAttribute("new_oe2ispopulationsufficient").getValue() != 1) {
                    oe2Applicability.setDisabled(false);
                }
                if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && isTester && formContext.getAttribute("new_testedasapartofoe2").getValue() == 100000000) {
                    oe2confirmationSection.setVisible(true);
                    agreeWithExistingDesign.setDisabled(false);
                    agreeWithControlDescription.setDisabled(false);
                }
                if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && isOwner && formContext.getAttribute("new_testedasapartofoe2").getValue() == 100000000) {
                    oe2confirmationSection.setVisible(true);
                }
                if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && formContext.getAttribute("new_agreewithexistingdesign").getValue() == 100000001) {
                    designConfirmation(executionContext);
                    formContext.ui.setFormNotification("Please reassess control design", "INFO", "123456")
                }
                if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && isTester && formContext.getAttribute("new_oe2agreewithexistingcontroldescription").getValue() == 100000001) {
                    updateControlDescription(executionContext);
                    formContext.ui.setFormNotification("Please reassess control information", "INFO", "1234567")
                }
                if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && formContext.getAttribute("new_testedasapartofoe2").getValue() == 100000000 && formContext.getAttribute("new_agreewithexistingdesign").getValue() == 100000000 && formContext.getAttribute("new_oe2agreewithexistingcontroldescription").getValue() == 100000000) {

                    oe2iucSection.setVisible(true);
                    oe2ipeSection.setVisible(true);
                    oe2populationSection.setVisible(true);
                    oe2confirmationSection.setVisible(true);
                    oe2notificationSection.setVisible(true);
                    oe2testingDocSection.setVisible(true);

                    if (isTester && (OEcontrolStatus != 100000030 || OEcontrolStatus != 100000017)) {
                        notifyTester.setVisible(false);
                    }
                    if (isOwner && (OEcontrolStatus != 100000030 || OEcontrolStatus != 100000017)) {
                        notifyOwner.setVisible(false);
                        notifyReviewer.setVisible(false);
                    }
                    if (isReviewer && (OEcontrolStatus != 100000030 || OEcontrolStatus != 100000017)) {
                        notifyOwner.setVisible(false);
                        notifyReviewer.setVisible(false);
                        notifyTester.setVisible(false);
                    }
                    if (isTester && formContext.getAttribute("new_oe2ispopulationsufficient").getValue() != 1 && formContext.getAttribute("new_oe2populationdata").getValue() == null && OEcontrolStatus == 100000021) {
                        populationDetails.setDisabled(false);
                        oe2Iuc.setDisabled(false);
                        oe2IucDescription.setDisabled(false);
                        oe2Source.setDisabled(false);
                        oe2ReportLogic.setDisabled(false);
                        oe2Parameters.setDisabled(false);
                        oe2Ipe.setDisabled(false);
                        oe2IpeDategenerated.setDisabled(false);
                        oe2IpeDescription.setDisabled(false);
                        oe2IpeSource.setDisabled(false);
                        oe2IpeReportLogic.setDisabled(false);
                        oe2IpeParameters.setDisabled(false);
                        oe2TestConclusion.setDisabled(false);
                        oe2AuditPeriodFrom.setDisabled(false);
                        oe2AuditPeriodTo.setDisabled(false);
                        notifyOwner.setVisible(true);
                        oe2isCTUploadEvidence.setDisabled(false);
                        
                    }
                    if (formContext.getAttribute("crf10_oe2isctuploadevidence").getValue() === true && isTester && formContext.getAttribute("new_oe2populationdetails").getValue() != null && formContext.getAttribute('new_oe2_testconclusion').getValue() == null) {
                        populationFileControl.setDisabled(false);
                        oe2evidenceUrl.setDisabled(false);
                        populationFileControl.setFocus();
                        notifyOwner.setVisible(false)

                    }
                    if ((populationDetails.getValue() != null || formContext.getAttribute("new_oe2populationdetails").getValue() != null) && formContext.getAttribute("new_oe2ispopulationsufficient").getValue() != 1 && OEcontrolStatus == 100000019 && isOwner) {
                        populationFileControl.setDisabled(false);
                        notifyOwner.setVisible(false);
                        notifyTester.setVisible(true);
                    }
                    
                    var populationFileData = formContext.getAttribute("new_oe2populationdata").getValue()
                    if ((populationFileData != null || formContext.getAttribute('crf10_oe2evidenceurl').getValue() != null) && OEcontrolStatus == 100000021 && formContext.getAttribute('new_oe2_testconclusion').getValue() == null && isTester) {
                        sampleSizeScreenshot.setDisabled(false);
                        populationSize.setDisabled(false);
                        populationChoiceControl.setDisabled(false);
                        populationRemarks.setDisabled(false);
                        sampleSize.setDisabled(false);
                        oe2isCTUploadSample.setDisabled(false)
                        areSamplesRequired.setDisabled(false);
                    }
                    if (areSamplesRequiredValue == false) {
                        sampleSizeScreenshot.setVisible(false);
                        oe2isCTUploadSample.setVisible(false);
                        evidenceFileControl.setVisible(false);
                        oe2sampleUrl.setVisible(false);
                        evidenceChoiceControl.setVisible(false);
                        evidenceRemarks.setVisible(false);
                    }
                    if (areSamplesRequiredValue == false && formContext.getAttribute("new_oe2ispopulationsufficient").getValue() == true) {
                        formContext.getAttribute('new_oe2isevidencesufficient').setValue(true)
                    }
                    if (formContext.getAttribute("crf10_oe2cttouploadsample").getValue() === true && isTester && formContext.getAttribute("new_oe2sampledefinition").getValue() != null && formContext.getAttribute('new_oe2_testconclusion').getValue() == null) {
                        evidenceFileControl.setDisabled(false);
                        oe2sampleUrl.setDisabled(false);
                        evidenceFileControl.setFocus();
                        notifyOwner.setVisible(false)
                    }
                    if (formContext.getAttribute('new_oe2_testconclusion').getValue() == null && OEcontrolStatus == 100000021 && isTester && formContext.getAttribute("crf10_oe2cttouploadsample").getValue() !== true && formContext.getAttribute('new_oe2ispopulationsufficient').getValue() == 1) {
                        notifyOwner.setVisible(true);
                    }
                    if (formContext.getAttribute('new_oe2_testconclusion').getValue() == null && OEcontrolStatus == 100000021 && isTester && formContext.getAttribute("crf10_oe2isctuploadevidence").getValue() !== true && formContext.getAttribute('new_oe2ispopulationsufficient').getValue() != 1) {
                        notifyOwner.setVisible(true);
                    }
                    if (formContext.getAttribute('new_oe2ispopulationsufficient').getValue() == 1 && OEcontrolStatus == 100000019 && formContext.getAttribute('new_oe2_testconclusion').getValue() == null && isOwner) {
                        evidenceFileControl.setDisabled(false);
                        notifyTester.setVisible(true);
                        notifyOwner.setVisible(false);
                    }
                    var evidenceFileData = formContext.getAttribute("new_oe2evidencedata").getValue();
                    /*if (evidenceFileData != null && isOwner) {
                        notifyTester.setVisible(true);
                        notifyOwner.setVisible(false);
                    }*/
                    if ((evidenceFileData != null || formContext.getAttribute('crf10_oe2sampleurl').getValue() != null) && formContext.getAttribute('new_oe2_testconclusion').getValue() == null && OEcontrolStatus == 100000021 && isTester) {
                        evidenceChoiceControl.setDisabled(false);
                        evidenceRemarks.setDisabled(false);
                        notifyOwner.setVisible(true);
                        populationChoiceControl.setDisabled(true);
                        populationRemarks.setDisabled(true);
                        oe2isCTUploadSample.setDisabled(true)
                    }
                    if (formContext.getAttribute('new_oe2isevidencesufficient').getValue() == 1 && OEcontrolStatus == 100000021 && isTester) {
                        //oe2testingDocSection.setVisible(true);
                        oe2reviewerSection.setVisible(true);
                        reviewerSelectionSection.setVisible(true);
                        oe2CoSection.setVisible(true);
                        notifyOwner.setVisible(false);
                        if (formContext.getAttribute('new_oe2_co_doyouagreewithtestconclusion').getValue() != 100000000) {
                            //oeTestSteps.setDisabled(false);
                            //oe2TestingPerformed.setDisabled(false);
                            //testConclusion.setDisabled(false);
                            //additionalDocumentation.setDisabled(false);
                            reviewerLookup.setDisabled(false)
                            oe2TestingPerformedattachment.setDisabled(false);
                        }
                        if (formContext.getAttribute('new_oe2_testconclusion').getValue() != null && formContext.getAttribute('new_oe2_doyouagreewithtestconclusion').getValue() != 100000000 && isTester) {
                            notifyReviewer.setVisible(true);
                        }
                    }
                    if (formContext.getAttribute('new_oe2isevidencesufficient').getValue() == 1 && OEcontrolStatus == 100000020 && isReviewer) {
                        oe2reviewerSection.setVisible(true);
                        //oe2testingDocSection.setVisible(true);
                        reviewerSelectionSection.setVisible(true);
                        reviewerConsent.setDisabled(false);
                        reviewerRemarks.setDisabled(false);
                    }
                    if (formContext.getAttribute('new_oe2isevidencesufficient').getValue() == 1 && isOwner) {
                        oe2reviewerSection.setVisible(true);
                        //oe2testingDocSection.setVisible(true);
                        reviewerSelectionSection.setVisible(true);
                        reviewerConsent.setDisabled(true);
                        reviewerRemarks.setDisabled(true);
                        evidenceFileControl.setDisabled(true);
                        notifyTester.setVisible(false);
                    }

                    if (formContext.getAttribute('new_oe2_doyouagreewithtestconclusion').getValue() == 100000000 && OEcontrolStatus == 100000019 && formContext.getAttribute('new_oe2_testconclusion').getValue() != null && isOwner) {
                        oe2reviewerSection.setVisible(true);
                        //oe2testingDocSection.setVisible(true);
                        oe2CoSection.setVisible(true);
                        controlOwnerConsent.setDisabled(false);
                        controlOwnerConsentRemarks.setDisabled(false);
                        evidenceFileControl.setDisabled(true);

                    }
                    if (formContext.getAttribute('new_oe2_doyouagreewithtestconclusion').getValue() == 100000000 && isTester) {
                        evidenceChoiceControl.setDisabled(true);
                        evidenceRemarks.setDisabled(true);
                        populationChoiceControl.setDisabled(true);
                        populationRemarks.setDisabled(true);
                    }
                    
                    if (OEcontrolStatus == 100000030 || OEcontrolStatus == 100000017) {

                        notifyTester.setVisible(false);
                        notifyReviewer.setVisible(false);
                        notifyOwner.setVisible(false);
                        reviewerConsent.setDisabled(true);
                        reviewerRemarks.setDisabled(true);
                        //oeTestSteps.setDisabled(true);
                        //oe2TestingPerformed.setDisabled(true);
                        //testConclusion.setDisabled(true);
                        oe2reviewerSection.setVisible(true);
                        //oe2testingDocSection.setVisible(true);
                        oe2CoSection.setVisible(true);
                        controlOwnerConsent.setDisabled(true);
                        controlOwnerConsentRemarks.setDisabled(true);

                    }

                }
            }
        }
    })

}

async function yeTab(executionContext) {


    // Initialize formContext and Comtrols, get tab visibility

    await retrieveOperation().then((retrievedUser) => {
        let currentUser = retrievedUser.toLowerCase();
        var formContext = executionContext.getFormContext();
        var processStage = formContext.data.process.getActiveStage();
        var processStageName = processStage.getName();

        if (formContext != undefined && formContext.ui != undefined) {
            let isOwner = (currentUser == (formContext.getAttribute("new_controlowneremail").getValue() != null ? formContext.getAttribute("new_controlowneremail").getValue().toLowerCase() : null));
            let isTester = (currentUser == (formContext.getAttribute("new_preparer").getValue() != null ? formContext.getAttribute("new_preparer").getValue().toLowerCase() : null))
            let isReviewer = (currentUser == (formContext.getAttribute("new_ye_revieweremail").getValue() != null ? formContext.getAttribute("new_ye_revieweremail").getValue().toLowerCase() : null))

            // Sections 
            var YETab = formContext.ui.tabs.get("YearEnd");
            //added on 20th jan
            YETab.setFocus();
            var YEcontrolStatus = formContext.getAttribute('new_controlstatus').getValue();
            var isTabVisible = YETab.getVisible();
            /*var auditSection = YETab.sections.get("AuditPeriod");
            auditSection.setVisible(false);*/
            var reviewerSection = YETab.sections.get("YE_ControlReviewerActions");
            reviewerSection.setVisible(false);
            var CoSection = YETab.sections.get("YE_ControlOwnerActions");
            CoSection.setVisible(false);
            var iucSection = YETab.sections.get("YE_IUCTesting");
            iucSection.setVisible(false);
            var ipeSection = YETab.sections.get("IPE_IPETesting");
            ipeSection.setVisible(false);
            var populationSection = YETab.sections.get("YE_PopulationDetails");
            populationSection.setVisible(false);
            var testingDocSection = YETab.sections.get("YE_TestingDocumentation");
            testingDocSection.setVisible(false);
            var notificationSection = YETab.sections.get("Year_End_section_11");
            notificationSection.setVisible(false);
            var reviewerSelectionSection = YETab.sections.get("YE_Reviewer");
            reviewerSelectionSection.setVisible(false);
            var confirmationSection = YETab.sections.get("YEConfirmationSection");
            confirmationSection.setVisible(false);

            // Fields

            var populationDetails = formContext.getControl('new_yepopulationdetails');
            populationDetails.setDisabled(true);
            var populationChoiceControl = formContext.getControl('new_yeispopulationsufficient');
            populationChoiceControl.setDisabled(true);
            var populationRemarks = formContext.getControl('new_yepopremarks');
            populationRemarks.setDisabled(true);
            var populationFileControl = formContext.getControl("new_yepopulationdata");
            populationFileControl.setDisabled(true);
            var notifyOwner = formContext.getControl("WebResource_yearEndNotifyOwner");
            notifyOwner.setVisible(false);
            var notifyTester = formContext.getControl("WebResource_yearEndNotifyTester");
            notifyTester.setVisible(false);
            //
            var updateDesign = formContext.getControl("WebResource_updateDesign");
            updateDesign.setVisible(false);
            var updateControlInfo = formContext.getControl("WebResource_updateControlInfo");
            updateControlInfo.setVisible(false);
            var evidenceFileControl = formContext.getControl("new_yeevidencedata");
            evidenceFileControl.setDisabled(true);
            var evidenceChoiceControl = formContext.getControl("new_yeisevidencesufficient");
            evidenceChoiceControl.setDisabled(true);
            var evidenceRemarks = formContext.getControl("new_yeevidenceremarks");
            evidenceRemarks.setDisabled(true);
            var controlOwnerConsent = formContext.getControl("new_ye_co_doyouagreewithtestconclusion");
            controlOwnerConsent.setDisabled(true);
            var controlOwnerConsentRemarks = formContext.getControl("new_yecoremarks");
            controlOwnerConsentRemarks.setDisabled(true);
            var YETestSteps = formContext.getControl("new_yeteststeps");
            //YETestSteps.setDisabled(true);
            var testConclusion = formContext.getControl("new_ye_testconclusion");
            //testConclusion.setDisabled(true)
            var notifyReviewer = formContext.getControl("WebResource_yearEndNotifyReviewer");
            notifyReviewer.setVisible(false)
            var reviewerConsent = formContext.getControl("new_ye_cr_doyouagreewithtestconclusion");
            reviewerConsent.setDisabled(true)
            var reviewerRemarks = formContext.getControl("new_yecrremarks");
            reviewerRemarks.setDisabled(true);

            var YEIuc = formContext.getControl("new_ye_isinformationusedintheperformance");
            YEIuc.setDisabled(true);
            var YEIucDescription = formContext.getControl("new_ye_descriptionofiuc");
            YEIucDescription.setDisabled(true);
            var YEIUCSource = formContext.getControl("new_ye_iuc_source");
            YEIUCSource.setDisabled(true);
            var YEIUCReportLogic = formContext.getControl("new_ye_iuc_reportlogic");
            YEIUCReportLogic.setDisabled(true);
            var YEIUCParameters = formContext.getControl("new_ye_iuc_parameters");
            YEIUCParameters.setDisabled(true);
            var YEIpe = formContext.getControl("new_ye_isipeutilizedinthetestingofthecontrol");
            YEIpe.setDisabled(true);
            var YEIpeDategenerated = formContext.getControl("new_ye_dategenerated");
            YEIpeDategenerated.setDisabled(true);
            var YEIpeDescription = formContext.getControl("new_yeipedescription");
            YEIpeDescription.setDisabled(true);
            var YEIpeSource = formContext.getControl("new_ye_source");
            YEIpeSource.setDisabled(true);
            var YEIpeReportLogic = formContext.getControl("new_ye_reportlogic");
            YEIpeReportLogic.setDisabled(true);
            var YEIpeParameters = formContext.getControl("new_ye_parameters");
            YEIpeParameters.setDisabled(true);
            var YETestConclusion = formContext.getControl("new_ye_conclusion");
            YETestConclusion.setDisabled(true);
            var YEAuditPeriodFrom = formContext.getControl("new_yeauditperiodfrom");
            YEAuditPeriodFrom.setDisabled(true);
            var YEAuditPeriodTo = formContext.getControl("new_yeauditperiodto");
            YEAuditPeriodTo.setDisabled(true);
            var sampleSizeScreenshot = formContext.getControl("new_yesampledefinition");
            sampleSizeScreenshot.setDisabled(true);
            var populationSize = formContext.getControl("new_ye_populationsize");
            populationSize.setDisabled(true);
            var sampleSize = formContext.getControl("new_ye_samplesize");
            sampleSize.setDisabled(true);
            var YEApplicability = formContext.getControl('new_testedasapartofyearend');
            YEApplicability.setDisabled(true);
            var agreeWithExistingDesign = formContext.getControl('new_ye_doyouagreewithexistingdesign');
            agreeWithExistingDesign.setDisabled(true);
            var agreeWithControlDescription = formContext.getControl('new_yeagreewithexistingcontroldescription');
            agreeWithControlDescription.setDisabled(true);
            var additionalDocumentation = formContext.getControl('new_ye_additionaldocumentation');
            //additionalDocumentation.setDisabled(true);
            var YETestingPerformed = formContext.getControl('new_yetestingperformed');
            //YETestingPerformed.setDisabled(true);
            var reviewerLookup = formContext.getControl('new_ye_reviewer');
            reviewerLookup.setDisabled(true);

            var yeisCTUploadEvidence = formContext.getControl("crf10_yeisctuploadevidence");
            yeisCTUploadEvidence.setDisabled(true);
            var yeevidenceUrl = formContext.getControl("crf10_yeevidenceurl");
            yeevidenceUrl.setDisabled(true);
            var yeisCTUploadSample = formContext.getControl("crf10_yecttouploadsample");
            yeisCTUploadSample.setDisabled(true);
            var yesampleUrl = formContext.getControl("crf10_yesampleurl");
            yesampleUrl.setDisabled(true);
            var areSamplesRequired = formContext.getControl('crf10_issamplesrequiredye');
            areSamplesRequired.setDisabled(true);
            var areSamplesRequiredValue = formContext.getAttribute('crf10_issamplesrequiredye').getValue();
            var yeTestingPerformedattachment = formContext.getControl('crf10_yetestingperformedattachment');
            yeTestingPerformedattachment.setDisabled(true);


            // Check conditions & Enable Controls
            if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && isTester && formContext.getAttribute("new_yeispopulationsufficient").getValue() != 1) {
                YEApplicability.setDisabled(false);
            }
            if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && isTester && formContext.getAttribute("new_testedasapartofyearend").getValue() == 100000000) {
                confirmationSection.setVisible(true);
                agreeWithExistingDesign.setDisabled(false);
                agreeWithControlDescription.setDisabled(false);
            }
            if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && isOwner && formContext.getAttribute("new_testedasapartofyearend").getValue() == 100000000) {
                confirmationSection.setVisible(true);
            }
            if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && formContext.getAttribute("new_ye_doyouagreewithexistingdesign").getValue() == 100000001) {
                designConfirmation(executionContext);
                formContext.ui.setFormNotification("Please reassess control design", "INFO")
            }
            if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && isTester && formContext.getAttribute("new_yeagreewithexistingcontroldescription").getValue() == 100000001) {
                updateControlDescription(executionContext);
                formContext.ui.setFormNotification("Please reassess control information", "INFO")
            }
            if (formContext != undefined && formContext.ui != undefined && isTabVisible == true && formContext.getAttribute("new_testedasapartofyearend").getValue() == 100000000 && formContext.getAttribute("new_ye_doyouagreewithexistingdesign").getValue() == 100000000 && formContext.getAttribute("new_yeagreewithexistingcontroldescription").getValue() == 100000000) {

                iucSection.setVisible(true);
                ipeSection.setVisible(true);
                testingDocSection.setVisible(true);
                populationSection.setVisible(true);
                confirmationSection.setVisible(true);
                notificationSection.setVisible(true);

                if (isTester && (YEcontrolStatus != 100000031 || YEcontrolStatus != 100000029)) {
                    notifyTester.setVisible(false);
                }
                if (isOwner && (YEcontrolStatus != 100000031 || YEcontrolStatus != 100000029)) {
                    notifyOwner.setVisible(false);
                    notifyReviewer.setVisible(false);
                }
                if (isReviewer && (YEcontrolStatus != 100000031 || YEcontrolStatus != 100000029)) {
                    notifyOwner.setVisible(false);
                    notifyReviewer.setVisible(false);
                    notifyTester.setVisible(false);
                }
                if (isTester && formContext.getAttribute("new_yeispopulationsufficient").getValue() != 1 && formContext.getAttribute("new_yepopulationdata").getValue() == null && YEcontrolStatus == 100000024) {
                    populationDetails.setDisabled(false);
                    YEIuc.setDisabled(false);
                    YEIucDescription.setDisabled(false);
                    YEIUCSource.setDisabled(false);
                    YEIUCReportLogic.setDisabled(false);
                    YEIUCParameters.setDisabled(false);
                    YEIpe.setDisabled(false);
                    YEIpeDategenerated.setDisabled(false);
                    YEIpeDescription.setDisabled(false);
                    YEIpeSource.setDisabled(false);
                    YEIpeReportLogic.setDisabled(false);
                    YEIpeParameters.setDisabled(false);
                    YETestConclusion.setDisabled(false);
                    YEAuditPeriodFrom.setDisabled(false);
                    YEAuditPeriodTo.setDisabled(false);
                    notifyOwner.setVisible(true);
                    yeisCTUploadEvidence.setDisabled(false);
                }
                if (formContext.getAttribute("crf10_yeisctuploadevidence").getValue() === true && isTester && formContext.getAttribute("new_yepopulationdetails").getValue() != null && formContext.getAttribute('new_ye_testconclusion').getValue() == null) {
                    populationFileControl.setDisabled(false);
                    yeevidenceUrl.setDisabled(false);
                    notifyOwner.setVisible(false);

                }
                if ((populationDetails.getValue() != null || formContext.getAttribute("new_yepopulationdetails").getValue() != null) && formContext.getAttribute("new_yeispopulationsufficient").getValue() != 1 && YEcontrolStatus == 100000025 && isOwner) {
                    populationFileControl.setDisabled(false);
                    notifyOwner.setVisible(false);
                    notifyTester.setVisible(true);
                }
                
                var populationFileData = formContext.getAttribute("new_yepopulationdata").getValue()

                if ((populationFileData != null || formContext.getAttribute('crf10_yeevidenceurl').getValue() != null) && YEcontrolStatus == 100000024 && formContext.getAttribute('new_ye_testconclusion').getValue() == null && isTester) {
                    sampleSizeScreenshot.setDisabled(false);
                    populationSize.setDisabled(false);
                    populationChoiceControl.setDisabled(false);
                    populationRemarks.setDisabled(false);
                    sampleSize.setDisabled(false);
                    yeisCTUploadSample.setDisabled(false);                    
                    areSamplesRequired.setDisabled(false);
                }
                if (areSamplesRequiredValue == false) {
                    sampleSizeScreenshot.setVisible(false);
                    yeisCTUploadSample.setVisible(false);
                    evidenceFileControl.setVisible(false);
                    yesampleUrl.setVisible(false);
                    evidenceChoiceControl.setVisible(false);
                    evidenceRemarks.setVisible(false);
                }
                if (areSamplesRequiredValue == false && formContext.getAttribute("new_yeispopulationsufficient").getValue() == true) {
                    formContext.getAttribute('new_yeisevidencesufficient').setValue(true)
                }
                if (formContext.getAttribute("crf10_yecttouploadsample").getValue() === true && isTester && formContext.getAttribute("new_yesampledefinition").getValue() != null && formContext.getAttribute('new_ye_testconclusion').getValue() == null) {
                    evidenceFileControl.setDisabled(false);
                    yesampleUrl.setDisabled(false);
                    notifyOwner.setVisible(false);
                }
                if (formContext.getAttribute('new_yeispopulationsufficient').getValue() != null && YEcontrolStatus == 100000024 && isTester) {
                    notifyOwner.setVisible(true);
                }
                if (formContext.getAttribute('new_ye_testconclusion').getValue() == null && YEcontrolStatus == 100000024 && isTester && formContext.getAttribute("crf10_yecttouploadsample").getValue() !== true && formContext.getAttribute('new_yeispopulationsufficient').getValue() == 1) {
                    notifyOwner.setVisible(true);
                }
                if (formContext.getAttribute('new_ye_testconclusion').getValue() == null && YEcontrolStatus == 100000024 && isTester && formContext.getAttribute("crf10_yeisctuploadevidence").getValue() !== true && formContext.getAttribute('new_yeispopulationsufficient').getValue() != 1) {
                    notifyOwner.setVisible(true);
                }
                if (formContext.getAttribute('new_yeispopulationsufficient').getValue() == 1 && YEcontrolStatus == 100000025 && formContext.getAttribute('new_ye_testconclusion').getValue() == null && isOwner) {
                    evidenceFileControl.setDisabled(false);
                    notifyTester.setVisible(true);
                    notifyOwner.setVisible(false);
                }
                var evidenceFileData = formContext.getAttribute("new_yeevidencedata").getValue();
                /*if (evidenceFileData != null && isOwner) {
                    notifyTester.setVisible(true);
                    notifyOwner.setVisible(false);
                }*/
                if ((evidenceFileData != null || formContext.getAttribute('crf10_yesampleurl').getValue() != null) && YEcontrolStatus == 100000024 && isTester) {
                    evidenceChoiceControl.setDisabled(false);
                    evidenceRemarks.setDisabled(false);
                    notifyOwner.setVisible(true);
                    populationChoiceControl.setDisabled(true);
                    populationRemarks.setDisabled(true);
                }
                if (formContext.getAttribute('new_yeisevidencesufficient').getValue() == 1 && YEcontrolStatus == 100000024 && isTester) {
                    //testingDocSection.setVisible(true);
                    reviewerSection.setVisible(true);
                    reviewerSelectionSection.setVisible(true);
                    CoSection.setVisible(true);
                    notifyOwner.setVisible(false);
                    if (formContext.getAttribute('new_ye_co_doyouagreewithtestconclusion').getValue() != 100000000) {
                        //YETestSteps.setDisabled(false);
                        //YETestingPerformed.setDisabled(false);
                        //testConclusion.setDisabled(false);
                        //additionalDocumentation.setDisabled(false);
                        reviewerLookup.setDisabled(false)
                        yeTestingPerformedattachment.setDisabled(false);
                    }
                    if (formContext.getAttribute('new_ye_testconclusion').getValue() != null && formContext.getAttribute('new_ye_cr_doyouagreewithtestconclusion').getValue() != 100000000 && isTester) {
                        notifyReviewer.setVisible(true);

                    }
                }
                if (formContext.getAttribute('new_yeisevidencesufficient').getValue() == 1 && YEcontrolStatus == 100000026 && isReviewer) {
                    reviewerSection.setVisible(true);
                    //testingDocSection.setVisible(true);
                    reviewerSelectionSection.setVisible(true);
                    reviewerConsent.setDisabled(false);
                    reviewerRemarks.setDisabled(false);
                }
                if (formContext.getAttribute('new_yeisevidencesufficient').getValue() == 1 && isOwner) {
                    reviewerSection.setVisible(true);
                    //testingDocSection.setVisible(true);
                    reviewerSelectionSection.setVisible(true);
                    reviewerConsent.setDisabled(true);
                    reviewerRemarks.setDisabled(true);
                    evidenceFileControl.setDisabled(true);
                    notifyTester.setVisible(false);
                }

                if (formContext.getAttribute('new_ye_cr_doyouagreewithtestconclusion').getValue() == 100000000 && formContext.getAttribute('new_ye_testconclusion').getValue() != null && isOwner) {
                    reviewerSection.setVisible(true);
                    //testingDocSection.setVisible(true);
                    CoSection.setVisible(true);
                    controlOwnerConsent.setDisabled(false);
                    controlOwnerConsentRemarks.setDisabled(false);
                    evidenceFileControl.setDisabled(true);

                }
                if (formContext.getAttribute('new_ye_cr_doyouagreewithtestconclusion').getValue() == 100000000 && isTester) {
                    evidenceChoiceControl.setDisabled(true)
                    evidenceRemarks.setDisabled(true);
                    populationChoiceControl.setDisabled(true)
                    populationRemarks.setDisabled(true)
                }
                if (YEcontrolStatus == 100000031 || YEcontrolStatus == 100000029) {

                    notifyTester.setVisible(false);
                    notifyReviewer.setVisible(false);
                    notifyOwner.setVisible(false);
                    reviewerConsent.setDisabled(true);
                    reviewerRemarks.setDisabled(true);
                    //YETestSteps.setDisabled(true);
                    //YETestingPerformed.setDisabled(true);
                    //testConclusion.setDisabled(true);
                    reviewerSection.setVisible(true);
                    //testingDocSection.setVisible(true);
                    CoSection.setVisible(true);
                    controlOwnerConsent.setDisabled(true);
                    controlOwnerConsentRemarks.setDisabled(true);
                    yeTestingPerformedattachment.setDisabled(true);

                }

            }
        }

    })
}

async function designConfirmation(executionContext) {
    // Initialize formContext and Comtrols, get tab visibility
    var formContext = executionContext.getFormContext();
    var processStage = formContext.data.process.getActiveStage();
    var processStageName = processStage.getName();
    await retrieveOperation().then((retrievedUser) => {
        let currentUser = retrievedUser.toLowerCase();
        let isOwner = (currentUser == (formContext.getAttribute("new_controlowneremail").getValue() != null ? formContext.getAttribute("new_controlowneremail").getValue().toLowerCase() : null));
        let isTester = (currentUser == (formContext.getAttribute("new_preparer").getValue() != null ? formContext.getAttribute("new_preparer").getValue().toLowerCase() : null))
        var controlStatus = formContext.getAttribute('new_controlstatus').getValue();
        var designdocumentationdetails = formContext.getControl('new_designdocumentation');
        designdocumentationdetails.setDisabled(true);
        var deNotifyOwner = formContext.getControl("WebResource_deNotifyOwner");
        deNotifyOwner.setVisible(false);
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
        var testerEmail = formContext.getControl("new_preparer");
        testerEmail.setDisabled(true);
        var reviewerEmail = formContext.getControl("new_reviewerlookup");
        reviewerEmail.setDisabled(true);
        var auditPeriodFrom = formContext.getControl("new_auditperiodfrom");
        auditPeriodFrom.setDisabled(true);
        var auditPeriodTo = formContext.getControl("new_auditperiodto");
        auditPeriodTo.setDisabled(true);
        var updateDesign = formContext.getControl("WebResource_updateDesign");
        updateDesign.setVisible(false);

        //Owner Fields
        var designAcceptance = formContext.getControl("new_designacceptance");
        designAcceptance.setDisabled(true);
        var designAcceptanceValue = (formContext.getAttribute("new_designacceptance").getValue() != null ? formContext.getAttribute("new_designacceptance").getValue() : null);
        var designEffectiviness = formContext.getControl("new_designeffectiviness");
        designEffectiviness.setDisabled(true)
        var designEffectivinessValue = (formContext.getAttribute("new_designeffectiviness").getValue() != null ? formContext.getAttribute("new_designeffectiviness").getValue() : null);
        var ddAcceptanceComments = formContext.getControl("new_ddcontrolownercomments");
        ddAcceptanceComments.setDisabled(true)
        var ddEffectivenessComments = formContext.getControl("new_dddesigneffectivenesscontrolownercomments");
        ddEffectivenessComments.setDisabled(true)

        // information fields
        var headCoordinator = formContext.getControl("new_headcoordinator");
        headCoordinator.setDisabled(true)
        var processOwner = formContext.getControl("new_processowner");
        processOwner.setDisabled(true)

        var whoExecutesTheActivityFunction = formContext.getControl("new_whoexecutestheactivityfunction");
        whoExecutesTheActivityFunction.setDisabled(true)
        var whatActionDoesThisPersonDo = formContext.getControl("new_whatactiondoesthispersondo");
        whatActionDoesThisPersonDo.setDisabled(true)
        var whatIsTheEvidenceQuestion = formContext.getControl("new_whatistheevidencethatthecontrolhasbeenper");
        whatIsTheEvidenceQuestion.setDisabled(true);
        var personRelevant = formContext.getControl("new_whyisthatpersonpositionrelevanttocontrol");
        personRelevant.setDisabled(true);
        var prerequisites = formContext.getControl("new_whataretheprerequisitestoperformcontrol");
        prerequisites.setDisabled(true);
        var frequency = formContext.getControl("new_frequency");
        frequency.setDisabled(true);
        var teamsInvolved = formContext.getControl("new_teamsinvolved");
        teamsInvolved.setDisabled(true);
        var itTeamsInvolved = formContext.getControl("new_itsystemsinvolved");
        itTeamsInvolved.setDisabled(true);

        var ddTestingPerformed = formContext.getControl("new_ddtestingperformed");
        ddTestingPerformed.setDisabled(true)

        // Check conditions & Enable Controls
        if (formContext != undefined && formContext.ui != undefined && (processStageName == "Operational Effectiveness 2" || processStageName == "Year End")) {


            if (isTester && (controlStatus == 100000022 || controlStatus == 100000027) && designAcceptanceValue != 100000000 && designEffectivinessValue != 100000000) {
                designdocumentationdetails.setDisabled(false);
                designdocumentationevidences.setDisabled(false);
                ddTestingPerformed.setDisabled(false);
                designSteps.setDisabled(false);
                questionaire1.setDisabled(false);
                questionaire2.setDisabled(false);
                deNotifyOwner.setVisible(true);
                additionalrecipients1.setDisabled(false);
                additionalrecipients2.setDisabled(false);
            }
            if (isOwner && (controlStatus == 100000023 || controlStatus == 100000028) && questionaire1Value == 0) {
                testerEmail.setVisible(true);
                designAcceptance.setDisabled(false);
                //    designEffectiviness.setVisible(true);
                ddAcceptanceComments.setDisabled(false);
                //    ddEffectivenessComments.setVisible(true);
                deNotifyOwner.setVisible(false);
            }
            if (isOwner && (controlStatus == 100000023 || controlStatus == 100000028) && questionaire1Value == 1) {
                testerEmail.setVisible(true);
                //    designAcceptance.setVisible(false);
                designEffectiviness.setDisabled(false);
                //    ddAcceptanceComments.setVisible(false);
                ddEffectivenessComments.setDisabled(false);
                deNotifyOwner.setVisible(false);
            }
            if (isOwner && (controlStatus == 100000023 || controlStatus == 100000028) && (designAcceptanceValue != null || designEffectivinessValue != null)) {
                updateDesign.setVisible(true);
            }
        }
    })

}

async function updateControlDescription(executionContext) {
    // Initialize formContext and Comtrols, get tab visibility
    var formContext = executionContext.getFormContext();

    await retrieveOperation().then((retrievedUser) => {
        let currentUser = retrievedUser.toLowerCase();
        let isTester = (currentUser == (formContext.getAttribute("new_preparer").getValue() != null ? formContext.getAttribute("new_preparer").getValue().toLowerCase() : null))
        var controlStatus = formContext.getAttribute('new_controlstatus').getValue();
        var whoExecutesTheActivityFunction = formContext.getControl("new_whoexecutestheactivityfunction");
        whoExecutesTheActivityFunction.setDisabled(true);
        var whatActionDoesThisPersonDo = formContext.getControl("new_whatactiondoesthispersondo");
        whatActionDoesThisPersonDo.setDisabled(true)
        var whatIsTheEvidenceQuestion = formContext.getControl("new_whatistheevidencethatthecontrolhasbeenper");
        whatIsTheEvidenceQuestion.setDisabled(true)
        var personRelevant = formContext.getControl("new_whyisthatpersonpositionrelevanttocontrol");
        personRelevant.setDisabled(true)
        var prerequisites = formContext.getControl("new_whataretheprerequisitestoperformcontrol");
        prerequisites.setDisabled(true)
        var frequency = formContext.getControl("new_frequency");
        frequency.setDisabled(true);
        var updateControlInfo = formContext.getControl("WebResource_updateControlInfo");
        updateControlInfo.setVisible(false);

        if (formContext != undefined && formContext.ui != undefined) {


            if (isTester && (controlStatus == 100000021 || controlStatus == 100000024)) {

                whoExecutesTheActivityFunction.setDisabled(false)
                whatActionDoesThisPersonDo.setDisabled(false)
                whatIsTheEvidenceQuestion.setDisabled(false)
                personRelevant.setDisabled(false)
                prerequisites.setDisabled(false)
                frequency.setDisabled(false)
                updateControlInfo.setVisible(true);
            }
        }
    })

}
