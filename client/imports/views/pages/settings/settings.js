import {Template} from "meteor/templating";
import {Settings} from "/lib/imports/collections";
import Helper from "/client/imports/helper";
import "./settings.html";

const toastr = require('toastr');
const Ladda = require('ladda');
/**
 * Created by RSercan on 9.1.2016.
 */

const proceedSavingSettings = function () {
    const settings = {};
    settings.autoCompleteSamplesCount = $('#inputAutoCompleteSamplesCount').val();
    settings.scale = $("#cmbScale").chosen().val();
    settings.defaultResultView = $("#cmbResultView").chosen().val();
    settings.maxAllowedFetchSize = $("#inputMaxAllowedFetchSize").val();
    settings.socketTimeoutInSeconds = $("#inputSocketTimeout").val();
    settings.connectionTimeoutInSeconds = $("#inputConnectionTimeout").val();
    settings.dbStatsScheduler = $("#inputDBStatsScheduler").val();
    settings.showDBStats = $('#divShowDBStats').iCheck('update')[0].checked;
    settings.showLiveChat = $('#divShowLiveChat').iCheck('update')[0].checked;
    settings.mongoBinaryPath = $('#inputMongoExecutable').val() || '';
    settings.singleTabResultSets = $('#divUseSingleTab').iCheck('update')[0].checked;
    settings.maxLiveChartDataPoints = $('#inputMaxChartPoints').val();

    Meteor.call('updateSettings', settings, function (err) {
        if (err) Helper.showMeteorFuncError(err, null, "Couldn't save");
        else toastr.success('Successfully saved !');
        Ladda.stopAll();
    });
};

Template.settings.onRendered(function () {
    $('#divShowDBStats, #divShowLiveChat, #divUseSingleTab').iCheck({
        checkboxClass: 'icheckbox_square-green'
    });
    $('#cmbScale, #cmbResultView').chosen();

    let settings = this.subscribe('settings');
    let connections = this.subscribe('connections');

    this.autorun(() => {
        if (settings.ready() && connections.ready()) {
            load();
        }
    });
});

Template.settings.events({
    'click #btnSaveSettings' (e) {
        e.preventDefault();

        Ladda.create(document.querySelector('#btnSaveSettings')).start();
        proceedSavingSettings();
    }
});

const load = function () {
    // since we are using some external plugins such as chosen, icheck we can't load settings directly via meteor
    const settings = Settings.findOne();
    if (!settings) return;

    const cmbScale = $('#cmbScale');
    const cmbResultView = $('#cmbResultView');

    cmbScale.val(settings.scale);
    cmbScale.trigger("chosen:updated");

    cmbResultView.val(settings.defaultResultView);
    cmbResultView.trigger("chosen:updated");

    $('#inputMaxAllowedFetchSize').val(settings.maxAllowedFetchSize || 0);
    $('#inputSocketTimeout').val(settings.socketTimeoutInSeconds || 0);
    $('#inputConnectionTimeout').val(settings.connectionTimeoutInSeconds || 0);
    $('#inputDBStatsScheduler').val(settings.dbStatsScheduler || 3000);
    $('#inputAutoCompleteSamplesCount').val(settings.autoCompleteSamplesCount || 50);
    $('#inputShowLiveChat').iCheck(settings.showLiveChat ? 'check' : 'uncheck');
    $('#inputUseSingleTab').iCheck(settings.singleTabResultSets ? 'check' : 'uncheck');
    $('#inputShowDBStats').iCheck(settings.showDBStats ? 'check' : 'uncheck');
    $('#inputMongoExecutable').val(settings.mongoBinaryPath || '');
    $('#inputMaxChartPoints').val(settings.maxLiveChartDataPoints || 15);

};