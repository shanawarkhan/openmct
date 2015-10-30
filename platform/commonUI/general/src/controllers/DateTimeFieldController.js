/*****************************************************************************
 * Open MCT Web, Copyright (c) 2014-2015, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT Web is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT Web includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/
/*global define,Promise*/

define(
    [],
    function () {
        'use strict';

        var UNRECOGNIZED_FORMAT_ERROR =
            "Unrecognized format for date-time field.";

        /**
         * Controller to support the date-time entry field.
         *
         * Accepts a `format` property in the `structure` attribute
         * which allows a date/time to be specified via its symbolic
         * key (as will be used to look up said format from the
         * `formatService`.)
         *
         * {@see FormatService}
         * @constructor
         * @memberof platform/commonUI/general
         * @param $scope the Angular scope for this controller
         * @param {FormatService} formatService the service to user to format
         *        domain values
         * @param {string} defaultFormat the format to request when no
         *        format has been otherwise specified
         */
        function DateTimeFieldController($scope, formatService, defaultFormat) {
            var formatter = formatService.getFormat(defaultFormat);

            function updateFromModel(value) {
                // Only reformat if the value is different from user
                // input (to avoid reformatting valid input while typing.)
                if (!formatter.validate($scope.textValue) ||
                        formatter.parse($scope.textValue) !== value) {
                    $scope.textValue = formatter.format(value);
                    $scope.textInvalid = false;
                }
            }

            function updateFromView(textValue) {
                $scope.textInvalid = !formatter.validate(textValue);
                if (!$scope.textInvalid) {
                    $scope.ngModel[$scope.field] =
                        formatter.parse(textValue);
                }
            }

            function setFormat(format) {
                formatter = formatService.getFormat(format || defaultFormat);
                if (!formatter) {
                    throw new Error(UNRECOGNIZED_FORMAT_ERROR);
                }
                updateFromModel($scope.ngModel[$scope.field]);
            }

            $scope.$watch('structure.format', setFormat);
            $scope.$watch('ngModel[field]', updateFromModel);
            $scope.$watch('textValue', updateFromView);
        }

        return DateTimeFieldController;
    }
);