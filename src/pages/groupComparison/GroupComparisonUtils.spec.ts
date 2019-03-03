import chai, {assert, expect} from 'chai';
import {ComparisonGroup, getCombinations, getStackedBarData, getVennPlotData} from './GroupComparisonUtils';
import { COLORS } from 'pages/studyView/StudyViewUtils';
import deepEqualInAnyOrder from "deep-equal-in-any-order";
import {makePlotData} from "../../shared/components/plots/StackedBarPlotUtils";
chai.use(deepEqualInAnyOrder);

describe('GroupComparisonUtils', () => {

    describe('getCombinations', () => {
        it('when empty groups', () => {
            assert.deepEqual(getCombinations([]), [])
        });

        it('when there are no overlapping groups', () => {
            assert.deepEqual(
                getCombinations([{
                    uid: '1',
                    cases: ['1-1', '1-2']
                }, {
                    uid: '2',
                    cases: ['2-1']
                }]), [
                    { groups: ['1'], cases: ['1-1', '1-2'] },
                    { groups: ['1', '2'], cases: [] },
                    { groups: ['2'], cases: ['2-1'] }
                ]);
        });

        it('when there are one or more overlapping groups', () => {
            assert.deepEqual(
                getCombinations([{
                    uid: '1',
                    cases: ['1-1', '1-2']
                }, {
                    uid: '2',
                    cases: ['1-1']
                }]), [
                    { groups: ['1'], cases: ['1-1', '1-2'] },
                    { groups: ['1', '2'], cases: ['1-1'] },
                    { groups: ['2'], cases: ['1-1'] }
                ]);

            assert.deepEqual(
                getCombinations([{
                    uid: '1',
                    cases: ['1-1', '1-2']
                }, {
                    uid: '2',
                    cases: ['1-1', '1-3']
                }, {
                    uid: '3',
                    cases: ['1-1', '1-2', '1-3']
                }]), [
                    { groups: ['1'], cases: ['1-1', '1-2'] },
                    { groups: ['1', '2'], cases: ['1-1'] },
                    { groups: ['1', '2', '3'], cases: ['1-1'] },
                    { groups: ['1', '3'], cases: ['1-1', '1-2'] },
                    { groups: ['2'], cases: ['1-1', '1-3'] },
                    { groups: ['2', '3'], cases: ['1-1', '1-3'] },
                    { groups: ['3'], cases: ['1-1', '1-2', '1-3'] }
                ]);

            assert.deepEqual(
                getCombinations([{
                    uid: '1',
                    cases: ['1-1', '1-2']
                }, {
                    uid: '2',
                    cases: ['1-2', '1-3']
                }, {
                    uid: '3',
                    cases: ['1-3', '1-1']
                }]), [
                    { groups: ['1'], cases: ['1-1', '1-2'] },
                    { groups: ['1', '2'], cases: ['1-2'] },
                    { groups: ['1', '2', '3'], cases: [] },
                    { groups: ['1', '3'], cases: ['1-1'] },
                    { groups: ['2'], cases: ['1-2', '1-3'] },
                    { groups: ['2', '3'], cases: ['1-3'] },
                    { groups: ['3'], cases: ['1-3', '1-1'] }
                ]);
        });
    });

    describe('getStackedBarData', () => {
        const uidToGroup = {
            "1":{
                uid:"1",
                name:"1",
                color:"#990099"
            } as ComparisonGroup,
            "2":{
                uid:"2",
                name:"2",
                color:"#0099c6"
            } as ComparisonGroup
        };
        it('when no data', () => {
            assert.deepEqual(getStackedBarData([], {}), [])
        });

        it('when there no overlapping groups', () => {
            assert.deepEqual(getStackedBarData([
                { uid: '1', cases: ['1-1'] },
                { uid: '2', cases: ['1-2'] }
            ], uidToGroup),
                [
                    [{ cases: ['1-1'], fill: '#990099', groupName: '1' }],
                    [{ cases: ['1-2'], fill: '#0099c6', groupName: '2' }]
                ]);
        });

        it('when there one or more overlapping groups', () => {

            (expect(getStackedBarData([
                { uid: '1', cases: ['1-1', '1-2'] },
                { uid: '2', cases: ['1-1'] }
            ], uidToGroup))
                .to.deep as any).equalInAnyOrder([
                [{ cases: ['1-1'], fill: '#CCCCCC', groupName: 'Overlapping Cases' }],
                [{ cases: [], fill: '#0099c6', groupName: '2' }],
                [{ cases: ['1-2'], fill: '#990099', groupName: '1' }]
            ]);
        });
    });

    describe('getVennPlotData', () => {
        it('when no data', () => {
            assert.deepEqual(getVennPlotData([]), [])
        });

        it('when there no overlapping groups', () => {
            assert.deepEqual(getVennPlotData([
                { groups: ['1'], cases: ['1-1'] },
                { groups: ['1', '2'], cases: [] },
                { groups: ['2'], cases: ['1-2'] }
            ]),
                [{ count: 1, size: 1, label: '1', sets: ['1'] },
                { count: 1, size: 1, label: '1', sets: ['2'] },
                { count: 0, size: 0, label: '0', sets: ['1', '2'] }]
            );
        });

        it('when there one or more overlapping groups', () => {
            assert.deepEqual(getVennPlotData([
                { groups: ['1'], cases: ['1-1', '1-2'] },
                { groups: ['1', '2'], cases: ['1-1'] },
                { groups: ['2'], cases: ['1-1'] }
            ]),
                [{ count: 2, size: 2, label: '2', sets: ['1'] },
                { count: 1, size: 1, label: '1', sets: ['1', '2'] },
                { count: 1, size: 1, label: '1', sets: ['2'] }]
            );
        });
    });

});