var comisionesURL = global_settings.urlCORS + 'api/controlDepositos/';


registrationModule.factory('comisionesRepository', function($http) {
    return {

        getDepartamentoBpro: function(sucursalID) {
            return $http({
                url: comisionesURL + 'departamentoBpro/',
                method: "GET",
                params: { sucursalID: sucursalID },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getcomisiones: function(params) {
            return $http({
                url: comisionesURL + 'comisiones/',
                method: "GET",
                params: params,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getcomisionesIva: function(idDepositoBanco) {
            return $http({
                url: comisionesURL + 'comisionesIva/',
                method: "GET",
                params: { idDepositoBanco: idDepositoBanco },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        selInteresComision: function( estatus, idEmpresa ) {
            return $http({
                url: comisionesURL + 'selInteresComision/',
                method: "GET",
                params:{
                    Estatus: estatus,
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        delInteresComision: function(interesComisionID) {
            return $http({
                url: comisionesURL + 'delInteresComision/',
                method: "GET",
                params: { interesComisionID: interesComisionID },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        delInteresComisionGrupo: function(agrupador, idEmpresa) {
            return $http({
                url: comisionesURL + 'delInteresComisionGrupo/',
                method: "GET",
                params: { agrupador: agrupador, idEmpresa: idEmpresa },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        insInteresComision: function(params) {
            return $http({
                url: comisionesURL + 'interesComision/',
                method: "GET",
                params: params,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        agrupadorComision: function(idEmpresa) {
            return $http({
                url: comisionesURL + 'agrupadorComision/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insInteresComisionDetalle: function(params) {
            return $http({
                url: comisionesURL + 'insInteresComisionDetalle/',
                method: "GET",
                params: params,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insCxpComisionesInteres: function(interesComisionID, idSucursal, idEmpresa) {
            return $http({
                url: comisionesURL + 'insCxpComisionesInteres/',
                method: "GET",
                params: { 
                    interesComisionID: interesComisionID, 
                    idSucursal: idSucursal, 
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        selInteresComisionDetalle: function(idcomisionInteres) {
            return $http({
                url: comisionesURL + 'selInteresComisionDetalle/',
                method: "GET",
                params: { idcomisionInteres: idcomisionInteres },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updAplicaComisiones: function(interesComisionID, idEmpresa) {
            return $http({
                url: comisionesURL + 'updAplicaComisiones/',
                method: "GET",
                params: { 
                    interesComisionID: interesComisionID,
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updAplicaComisionesGrupo: function(idEmpresa) {
            return $http({
                url: comisionesURL + 'updAplicaComisionesGrupo/',
                method: "GET",
                params: { 
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        testApi: function(objData) {

            console.log(objData);

            return $http({
                url: comisionesURL + 'testApi/',
                method: "GET",
                params: objData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getClientByName: function(clientName) {
            return $http({
                url: comisionesURL + 'clientByName/',
                method: "GET",
                params: {
                    clientName: clientName
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        gridComisionesOptions: function() {
            return {
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                enableSelectAll: false,
                selectionRowHeaderWidth: 35,
                rowHeight: 35,
                showGridFooter: true,
                enableFiltering: true
            };
        },
        gridComisionesColumns: function() {
            return [
                { name: 'concepto', displayName: 'Concepto', cellClass: 'gridCellLeft', width: '*' },
                { name: 'referencia', displayName: 'Referencia', cellClass: 'gridCellRight', width: 100 },
                { name: 'fechaOperacion', displayName: 'Fecha', type: 'date', cellClass: 'gridCellRight', cellFilter: 'date:\'yyyy-MM-dd\'', width: 100 },
                { name: 'abono', displayName: 'Abono', type: 'number', cellFilter: 'currency', cellClass: 'gridCellRight', width: 100 }
            ];
        },

        gridInteresOptions: function() {
            return {
                enableRowSelection: true,
                enableSelectAll: false,
                selectionRowHeaderWidth: 35,
                rowHeight: 35,
                showGridFooter: true,
                enableFiltering: true
            };
        },
        gridInteresColumns: function() {
            return [
                { name: 'concepto', displayName: 'Concepto', cellClass: 'gridCellLeft', width: '*' },
                { name: 'referencia', displayName: 'Referencia', cellClass: 'gridCellRight', width: 100 },
                { name: 'fechaOperacion', displayName: 'Fecha', type: 'date', cellClass: 'gridCellRight', cellFilter: 'date:\'yyyy-MM-dd\'', width: 100 },
                { name: 'abono', displayName: 'Abono', type: 'number', cellFilter: 'currency', cellClass: 'gridCellRight', width: 100 }
            ];
        },

        getComisionTemplate: function() {
            return [{
                consecutivo: 1,
                cuenta: "700A-000B-0002-0009",
                concepto: "Comisiones bancarias Provisión",
                descripcion: "Comisiones bancarias",
                cargo: 0,
                abono: 0,
                tipodocumento: '',
                tipo: 'C',
                showSub: true
            }, {
                consecutivo: 2,
                cuenta: "1100-0065-000F-0004",
                concepto: "Comisiones bancarias Provisión",
                descripcion: "IVA por Acreditar a/d mxp",
                cargo: 0,
                abono: 0,
                tipodocumento: 'FACIVA',
                tipo: 'A',
                showSub: false
            }, {
                consecutivo: 3,
                cuenta: "2100-0002-000F-0001",
                concepto: "Comisiones bancarias Provisión",
                descripcion: "Acreedores diversos mxp",
                cargo: 0,
                abono: 0,
                tipodocumento: 'FAC',
                tipo: 'A',
                showSub: false

            }];
        },


        getClientById: function(idBusqueda) {
            return $http({
                url: comisionesURL + 'clientById/',
                method: "GET",
                params: {
                    idBusqueda: idBusqueda
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        }
    };

});