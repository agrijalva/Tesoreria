﻿registrationModule.controller('comisionesController', function($scope, $rootScope, $location, localStorageService, filtrosRepository, alertFactory, $http, $log, $timeout, uiGridConstants, comisionesRepository, filterFilter) {

    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = $rootScope.userData.idUsuario;

    $scope.objEdicion = {
        usarMontoCalculado: false,
        montoAcumuladoUsuario: 0,
        muestraMontoInicial: true
    };

    $scope.sumaDetalle = { cargo: 0, abono: 0 };

    $scope.lstEmpresaUsuario = [];
    $scope.lstBanco = [];
    $scope.lstDetalle = [];
    $scope.lstCuenta = [];
    $scope.lstSucursal = [];
    $scope.lstDepartamento = [];
    $scope.lstTemp = [];
    $scope.lstRegistroContable = [];
    //Depositos controles Habilitados
    $scope.ddlBancoDisabled = true;
    $scope.ddlCuentaDisabled = true;
    $scope.txtFechasDisabled = true;
    $scope.btnBuscarDisabled = true;
    $scope.carteraControlsDisabled = true;

    $scope.selectedValueEmpresaID = 0;
    $scope.selectedValueSucursalID = 0;
    $scope.selectedDepartamento = [];
    $scope.selectedValueBancoID = 0;
    $scope.selectedValueCuentaID = 0;
    $scope.selectedValueFechaInicio = '';
    $scope.selectedValueFechaFin = '';
    $scope.currentComisionHeaderID = 0;
    $scope.showSub = false;
    //init grids
    $scope.gridComisiones = comisionesRepository.gridComisionesOptions;
    $scope.gridComisiones.columnDefs = comisionesRepository.gridComisionesColumns();
    $scope.gridComisiones.multiSelect = true;
    $scope.gridComisiones.rowTemplate = '<div> <div ng-style="row.entity.color != \'\' ? {\'background-color\': row.entity.color } : {}" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ui-grid-cell></div></div>';


    $scope.gridInteres = comisionesRepository.gridInteresOptions;
    $scope.gridInteres.columnDefs = comisionesRepository.gridInteresColumns();
    $scope.gridInteres.multiSelect = true;
    $scope.gridInteres.rowTemplate = '<div> <div ng-style="row.entity.color != \'\' ? {\'background-color\': row.entity.color } : {}" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ui-grid-cell></div></div>';

    $scope.gridComisionesRow = [];
    $scope.gridInteresRow = null;

    $scope.interesComisionID = 0;
    $scope.loadingDetalle = false;

    $scope.gruposComisionesData = [];


    $scope.btn_createcom_text = 'Crear Referencia';
    $scope.btn_createcom_flag = false;

    var activeTab = "list-group-item active text-center";
    var notActiveTab = "list-group-item text-center";

    $scope.lstTabs = [
        { description: "Buscar", disabled:false, stepIsComplete: false, isActive: true, className: activeTab, iconName: "glyphicon glyphicon-search" },
        { description: "Comisiones", disabled:true, stepIsComplete: false, isActive: false, className: notActiveTab, iconName: "glyphicon glyphicon-eye-open" },
        { description: "Deptos", disabled:true, stepIsComplete: false, isActive: false, className: notActiveTab, iconName: "glyphicon glyphicon-briefcase" },
        { description: "Detalle", disabled:false, stepIsComplete: false, isActive: false, className: notActiveTab, iconName: "glyphicon glyphicon-list" },
        { description: "Aplicados", disabled:false, stepIsComplete: false, isActive: false, className: notActiveTab, iconName: "glyphicon glyphicon-ok" }
    ];

    $scope.$watch('lstTabs[0].isActive', function(active, oldActive) { // Buscar
        if( active ){$scope.EliminarComision(); }
        console.log( 'Eliminar desde Buscar' );
    });

    $scope.$watch('lstTabs[1].isActive', function(active, oldActive) { // Comision
        // if( active ){$scope.EliminarComision(); }
    });
    $scope.$watch('lstTabs[2].isActive', function(active, oldActive) { // Depositos
        // if( active ){$scope.EliminarComision(); }
    });
    $scope.$watch('lstTabs[3].isActive', function(active, oldActive) { // Detalle
        // setTimeout(function(){
            console.log( 'Eliminar desde Detalle' );
            if( active ){$scope.EliminarComision(); }            
        // },1000)
    });
    $scope.$watch('lstTabs[4].isActive', function(active, oldActive) { // Aplicados
        console.log( 'Eliminar desde Aplicados' );
        if( active ){$scope.EliminarComision(); }
    });

    $scope.$watch('lstTabs[1].isActive', function(active, oldActive) {
        if (active && active !== oldActive && $scope.gridApi) {
            $timeout(function() {
                $scope.gridApi.grid.handleWindowResize();
            });
        }
    });


    $scope.$watch('lstTabs[1].isActive', function(active, oldActive) {
        // console.log("Estoy viendo 2");
        if (active && active !== oldActive && $scope.gridApiInteres) {
            $timeout(function() {
                $scope.gridApiInteres.grid.handleWindowResize();
            });
        }
    });

    filtrosRepository.getEmpresas($scope.idUsuario).then(function(result) {
        if (result.data.length > 0) {
            $scope.lstEmpresaUsuario = result.data;
            $scope.initCalendarstyle();
        }
    });

    $scope.EliminarComision = function(){
        if( $scope.interesComisionID != 0 ){
            comisionesRepository.delInteresComision($scope.interesComisionID).then(function(result) {
                comisionesRepository.selInteresComision().then(function(result2) {
                    $scope.interesComisionID = 0;
                    console.log( 'interesComisionID', $scope.interesComisionID );

                    $scope.lstSucursal = { suc_nombre: "", suc_idsucursal: 0 };
                    $scope.selectedValueSucursalID = 0;
                    $scope.selectedDepartamento = { subCuenta: 0 };
                    $scope.lstDepartamento ={sucursalID:0,cuentaContable:0,descripcion:"",subCuenta:0,};

                    $scope.lstRegistroContable = [];
                    $scope.showSub = false;
                    $scope.gridInteresRow = [];
                    $scope.gridComisionesRow = [];
                    $scope.objEdicion.montoAcumuladoUsuario = 0;


                    $scope.lstTemp = result2.data;
                    $scope.getComisionesRealizadas();
                    $scope.loadingDetalle = false;
                });
            });
        }
        else{
            $scope.loadingDetalle = false;
        }
    }

    $scope.getComisionesRealizadas = function(){ // Comisiones Temporales y Aplicadas
        comisionesRepository.selInteresComision( 1 ).then(function(result) {
            $scope.lstTemp = result.data;
        });

        comisionesRepository.selInteresComision( 2 ).then(function(result) {
            $scope.lstAplicadas = result.data;
        });
    }

    $scope.getComisionesRealizadas();

    $scope.getBancos = function() {
        $scope.lstBanco     = [];
        $scope.lstCuenta    = [];
        $scope.selectedValueBancoID     = 0;
        $scope.selectedValueCuentaID    = 0;

        var idEmpresa = $scope.selectedValueEmpresaID;
        $scope.ddlBancoDisabled = false;

        filtrosRepository.getBancos(idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.lstBanco = result.data;
            }
        });
    };

    $scope.getCuentas = function() {
        $scope.lstCuenta    = [];
        $scope.selectedValueCuentaID    = 0;

        var idBanco = $scope.selectedValueBancoID;
        var idEmpresa = $scope.selectedValueEmpresaID;

        $scope.ddlCuentaDisabled = false;

        filtrosRepository.getCuenta(idBanco, idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.lstCuenta = result.data;
            }
        });
    };

    $scope.getDepartamentosBpro = function(id) {
        $scope.objEdicion.montoAcumuladoUsuario = 0;
        $('#tblDepartamentos').DataTable().destroy();
        $('#mdlLoading').modal('show');
        $scope.lstDepartamento = [];
        comisionesRepository.getDepartamentoBpro(id).then(function(result) {
            if (result.data.length > 0) {
                $scope.lstDepartamento = result.data;
                $('#mdlLoading').modal('hide');
            } else {
                $('#mdlLoading').modal('hide');
            }
        });
    };


    $scope.getSucursales = function() {

        var idEmpresa = $scope.selectedValueEmpresaID;

        filtrosRepository.getSucursales($scope.idUsuario, idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.lstSucursal = result.data;
            }
        });
    };

    $scope.enableCalendar = function() {
        $scope.txtFechasDisabled = false;
        $scope.btnBuscarDisabled = false;
    };


    

    $scope.msgTempSave = function() {

        if ($scope.gridInteresRow === null || $scope.gridComisionesRow === null) {
            swal("Aviso", "No ha seleccioando un interes", "warning");
        } else {

            swal({
                    title: "¿Esta seguro?",
                    text: "Se creará una referencia",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#21B9BB",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                function() {
                    $scope.tempSave();
                });
        }

    };

    $scope.tempSave = function() {
        $scope.setActiveTab($scope.lstTabs[2]);
        $scope.curComIndex = 0;

        // var params = {
        //     interesID: $scope.gridInteresRow.idDepositoBanco,
        //     comisionID: $scope.gridComisionesRow.idDepositoBanco,
        //     bancoID: $scope.gridComisionesRow.idBanco,
        //     userID: $scope.idUsuario,
        //     statusID: 1
        // };

        // comisionesRepository.insInteresComision(params).then(function(result) {
        //     $scope.currentComisionHeaderID = result.data[0].headerID;
        //     $scope.getComisionesRealizadas();
        //     comisionesRepository.selInteresComision( 1 ).then(function(result) {
        //         $scope.lstTemp = result.data;
        //         $scope.getComisiones();
        //         $scope.gridInteres.data = [];
        //         $scope.setActiveTab($scope.lstTabs[2]);
        //         setTimeout( function(){
        //             $scope.interesComisionID = $scope.currentComisionHeaderID;  
        //             $scope.loadingDetalle = true;                  
        //         },1000);
        //     });
        // });

    };

    $scope.back_to_comisiones = function(){
        $scope.setActiveTab($scope.lstTabs[1]);
    }

    $scope.tempSaveDetail = function() {


    };


    $scope.aplicar = function() {
        swal({
            title: "¿Esta seguro?",
            text: "Se aplicarán todas las referencias",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#21B9BB",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
        },
        function() {
            var aux = 0;
            $scope.lstTemp.forEach(function(row) {
                comisionesRepository.updAplicaComisiones(row.interesComisionID);
            });

            swal({
                title: "Aplicado",
                text: "Referencias aplicadas correctamente!",
                type: "success",
                showCancelButton: false,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Aceptar",
                closeOnConfirm: true
            },
            function(){
                $scope.getComisionesRealizadas();
                $scope.setActiveTab($scope.lstTabs[4]);
            });
        });
    };

    $scope.showDetail = function(item) {
        comisionesRepository.selInteresComisionDetalle(item.interesComisionID).then(function(result) {
            $scope.lstDetalle = result.data;
            $scope.sumaDetalle.cargo = 0;
            $scope.sumaDetalle.abono = 0;
            $scope.lstDetalle.forEach(function(row) {
                $scope.sumaDetalle.cargo += parseFloat(row.cid_cargo);
                $scope.sumaDetalle.abono += parseFloat(row.cid_abono);
            });

            $scope.sumaDetalle.cargo = parseFloat($scope.sumaDetalle.cargo);
            $scope.sumaDetalle.abono = parseFloat($scope.sumaDetalle.abono);

            $('#mdlDetail').modal('show');
        });
    };


    $scope.initCalendarstyle = function() {
        $('#calendar .input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: true,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            todayHighlight: true,
            format: "dd/mm/yyyy"
        });
    };

    $scope.sumUserAmount = function() {
        $scope.objEdicion.montoAcumuladoUsuario = 0;
        $scope.lstDepartamento.forEach(function(row) {
            $scope.objEdicion.montoAcumuladoUsuario += Number(row.userValue);
        });
    };

    $scope.setActiveTab = function(item) {
        $scope.lstTabs.forEach(function(row) {
            row.className = notActiveTab;
            row.isActive = false;
        });

        item.className = activeTab;
        item.isActive = true;

    };

    $scope.toggleShowSub = function() {
        $scope.montoAcumuladoUsuario = 0;
        if ($scope.showSub === true) {
            $scope.showSub = false;
            $scope.objEdicion.usarMontoCalculado = false;
        } else {
            $scope.showSub = true;
            $scope.objEdicion.usarMontoCalculado = true;
        }
    };


    $scope.showSubcuentas = function() {
        $('#mdlSubcuentas').modal('show');
    };


    $scope.insInteresComisionDetalle = function() {
        var excludeFirstRow = false;

        if ($scope.objEdicion.usarMontoCalculado === true) {
            excludeFirstRow = true;
        } else {
            $scope.lstDepartamento.forEach(function(row) {
                if (row.userValue > 0) {
                    excludeFirstRow = true;
                }
            });
        }

        var counter = 0;

        console.log( '============================' );
        // console.log( $scope.currentComisionHeaderID );
        console.log( 'selectedValueEmpresaID', $scope.selectedValueEmpresaID );
        console.log( '============================' );
        comisionesRepository.insCxpComisionesInteres($scope.currentComisionHeaderID, $scope.selectedDepartamento.sucursalID, $scope.selectedValueEmpresaID).then(function(result) {
            var headerID       = result.data[0].headerID;
            var nextRef        = result.data[0].nextRef;
            var idPersona      = result.data[0].idPersona;
            var lastReferencia = result.data[0].lastReferencia;
            var baseReferencia = result.data[0].baseReferencia;

            var DocumentoConsecutivo = '';
            if( lastReferencia === null || lastReferencia === '' ){
                DocumentoConsecutivo = baseReferencia + '1';
            }
            else{
                var aux = lastReferencia.split('-');
                if( aux.length == 4 ){
                    var aux_actual = parseInt(aux[3]);
                    DocumentoConsecutivo = baseReferencia + (aux_actual + 1);
                }
                else{
                    DocumentoConsecutivo = baseReferencia + '1';
                }
            }

            $scope.rowsToInsert = [];

            $scope.lstRegistroContable.forEach(function(row, index) {

                if (excludeFirstRow === true && index === 0) {
                    console.log('OK');
                } else {

                    var params = {};

                    params.cuentacontable = row.cuenta;
                    params.concepto = row.concepto;
                    params.cargo = row.cargo;
                    params.abono = row.abono;
                    params.documento = DocumentoConsecutivo;
                    params.idpersona = idPersona; // $scope.idUsuario;
                    params.idcomisionesintereses = headerID;
                    params.tipodocumento = row.tipodocumento;
                    params.fechavencimiento = '2017/01/01'; //Tampoco sabe que ira aqui 
                    params.poriva = 16;
                    params.referencia = DocumentoConsecutivo;//''; //Menos este lo hace BPRO?
                    params.banco = '0' + $scope.selectedValueBancoID;
                    params.referenciabancaria = nextRef; //'00000000000000000001';
                    params.conpoliza = 1;//counter += 1;

                    $scope.rowsToInsert.push(params);
                }
            });


            $scope.lstDepartamento.forEach(function(row, index) {

                var params = {};
                params.cuentacontable = row.cuentaContable;
                params.concepto = row.descripcion.substring(7);
                params.cargo = 0; // (row.porcentaje * $scope.objEdicion.montoAcumuladoUsuario) / 100;
                params.abono = 0;
                params.documento = DocumentoConsecutivo;
                params.idpersona = idPersona;// $scope.idUsuario;
                params.idcomisionesintereses = headerID;
                params.tipodocumento = '';
                params.fechavencimiento = '2017/01/01'; //Tampoco sabe que ira aqui 
                params.poriva = 16;
                params.referencia = DocumentoConsecutivo;// ''; //Menos este lo hace BPRO?
                params.banco = '0' + $scope.selectedValueBancoID;
                params.referenciabancaria = nextRef; //0;
                params.conpoliza = 1;//counter += 1;

                if ($scope.objEdicion.usarMontoCalculado === true) {
                    //params.userValue = ($scope.gridComisionesRow.abono * row.porcentaje) / 100;
                    params.cargo = (row.porcentaje * $scope.objEdicion.montoAcumuladoUsuario) / 100;
                    $scope.rowsToInsert.push(params);
                } else {
                    if (row.userValue > 0) {
                        params.cargo = row.userValue;
                        $scope.rowsToInsert.push(params);
                    }
                }
            });


            //console.log($scope.rowsToInsert);
            ////////////////////////////////////////////////////////////////////////////

            $scope.rowsToInsert.reduce(
                function(sequence, value) {
                    return sequence.then(function() {
                        console.log( value );
                        return $scope.insertaInteresComisionDetalle(value);
                    }).then(function(obj) {});
                },
                Promise.resolve()
            ).then(function() {

                $scope.lstSucursal = { suc_nombre: "", suc_idsucursal: 0 };
                $scope.selectedValueSucursalID = 0;
                $scope.selectedDepartamento = { subCuenta: 0 };
                $scope.lstDepartamento ={sucursalID:0,cuentaContable:0,descripcion:"",subCuenta:0,};

                $scope.lstRegistroContable = [];
                $scope.showSub = false;
                $scope.gridInteresRow = [];
                $scope.gridComisionesRow = [];
                $scope.objEdicion.montoAcumuladoUsuario = 0;
                swal("Creado", "Se genero un asiento Contable", "success");
            });
            ////////////////////////////////////////////////////////////////////////////////


        });

    };
    ////////////////////////////////////////////////////////
    $scope.insertaInteresComisionDetalle = function(row) {
        return new comisionesRepository.insInteresComisionDetalle(row).then(function(result) {
            return result.data;
        });

    };
    ////////////////////////////////////////////////////////


    $scope.deleteReference = function(item) {
        swal({
            title: "¿Esta seguro?",
            text: "Se eliminará el registro",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#21B9BB",
            confirmButtonText: "Aceptar",
            closeOnConfirm: true
        },
        function() {
            comisionesRepository.delInteresComision(item.interesComisionID).then(function(result) {
                comisionesRepository.selInteresComision().then(function(result2) {
                    $scope.lstTemp = result2.data;
                    $scope.getComisionesRealizadas();
                    swal("Eliminado", "Se eliminó el registro", "success");
                });
            });
        });
    };


    $scope.formar_number = function(number, c, d, t){
        var n = number, 
            c = isNaN(c = Math.abs(c)) ? 2 : c, 
            d = d == undefined ? "." : d, 
            t = t == undefined ? "," : t, 
            s = n < 0 ? "-" : "", 
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }

    $scope.gruposComisiones = [];
    $scope.currentColor = '#c9dde1';
    $scope.currentGrupo = 0;

    $scope.NewGroup = function(){ // c9dde1
        // var name =  $scope.gruposComisiones.length + 1;
        $scope.currentGrupo = $scope.currentGrupo + 1;
        $scope.gruposComisiones.push({ name: $scope.currentGrupo, color: $scope.currentColor, status:1 });
        $("#panelTest").scrollTop(500000);
    }

    $scope.getNewColor = function(){ 
        hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F") 
        color_aleatorio = "#"; 
        for ( i = 0; i < 6; i++ ){ 
            posarray = $scope.aleatorio(0,hexadecimal.length)
            // console.log( posarray );
            color_aleatorio += hexadecimal[posarray] 
        } 
        // console.log( color_aleatorio );
        return color_aleatorio;
    }

    $scope.aleatorio = function(inferior,superior){ 
        numPosibilidades = superior - inferior 
        aleat = Math.random() * numPosibilidades 
        aleat = Math.floor(aleat) 
        return parseInt(inferior) + aleat 
    }

    $scope.temporalRow = {};
    $scope.gridComisiones.onRegisterApi = function(gridApi) {
        $scope.gridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            if( row.isSelected ){
                console.log('seleccioando');
                $scope.NewGroup();
                row.entity.color = $scope.currentColor;
                $scope.gridComisionesRow = row.entity;

                var current = filterFilter($scope.gruposComisiones, {color: $scope.currentColor});
                var idGrupo = current[0].name;
                $scope.temporalRow = row.entity;

                $scope.getComisionesIva(row.entity.idDepositoBanco);
            }
            else{
                console.log('deseleccionar');
                var current = filterFilter($scope.gruposComisiones, {color: row.entity.color});
                var idGrupo = current[0].name;

                var tempArrayAux = [];
                $scope.gruposComisionesData.forEach( function( item, key ){
                    if( item.grupo != idGrupo ){
                        tempArrayAux.push( item );
                    }
                });
                $scope.gruposComisionesData = tempArrayAux;

                tempArrayAux = [];
                $scope.gridInteres.data.forEach( function( item, key ){
                    if( item.color != row.entity.color ){
                        tempArrayAux.push( item );   
                    }
                });
                $scope.gridInteres.data = tempArrayAux;

                tempArrayAux = [];
                $scope.gruposComisiones.forEach( function( item, key ){
                    // console.log( "Coloralex", item.color );
                    if( item.color != row.entity.color ){
                        tempArrayAux.push( item );   
                    } 
                });
                $scope.gruposComisiones = tempArrayAux;

                // console.log( $scope.gruposComisionesData );
                row.entity.color = "";
            }

            if( $scope.gruposComisiones.length == 0 ){
                $scope.btn_createcom_flag = false;
                // $scope.btn_createcom_text = 'Este boton deberia ocultarse o al menos deshabilitarse';
            }
            else if( $scope.gruposComisiones.length == 1 ){
                $scope.btn_createcom_flag = true;
                $scope.btn_createcom_text = 'Crear Referencia';
            }
            else{
                $scope.btn_createcom_flag = true;
                $scope.btn_createcom_text = 'Crear Referencia Grupal';
            }
            console.log( 'Cantidad de referencias', $scope.gruposComisiones.length );
        });
    };


    $scope.gridInteres.onRegisterApi = function(gridApi) {
        $scope.gridApiInteres = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.gridInteresRow = row.entity;
            $scope.msgTempSave();
        });

    };

    $scope.gridInteres.isRowSelectable = function(row) {
        return false;
    };

    $scope.getComisiones = function() {
        $scope.gruposComisiones     = [];
        $scope.currentColor         = '#c9dde1';
        $scope.currentGrupo         = 0;
        $scope.gridInteres.data     = [];
        $scope.gruposComisionesData = [];
        $scope.btn_createcom_flag   = false;

        $scope.EliminarComision();
        $scope.setActiveTab($scope.lstTabs[1]);

        var params = {
            idBanco: $scope.selectedValueBancoID,
            noCuenta: $scope.selectedValueCuentaID,
            fechaIni: $scope.selectedValueFechaInicio,
            fechaFin: $scope.selectedValueFechaFin
        };

        $scope.carteraControlsDisabled = false;

        $('#mdlLoading').modal('show');
        $scope.gridComisiones.data = [];
        comisionesRepository.getcomisiones(params).then(function(result) {
            if (result.data.length > 0) {
                $scope.gridComisiones.data = result.data;
                $scope.getSucursales();
                $('#mdlLoading').modal('hide');
            } else {
                $('#mdlLoading').modal('hide');
            }
        });
    };

    
    $scope.getComisionesIva = function(depositoID) {

        $('#mdlLoading').modal('show');
        // $scope.gridInteres.data = [];
        comisionesRepository.getcomisionesIva(depositoID).then(function(result) {
            if (result.data.length > 0) {
                result.data[0].color = $scope.currentColor;
                $scope.gridInteres.data.push(result.data[0]);

                // console.log( $scope.gruposComisiones );
                var current = filterFilter($scope.gruposComisiones, {color: $scope.currentColor});
                var idGrupo = current[0].name; 
                $scope.gruposComisionesData.push({grupo: idGrupo, data:[$scope.temporalRow,result.data[0]]}); 

                $('#mdlLoading').modal('hide');

                // Se deja preparado un nuevo color para pintarse en el grid.
                $scope.currentColor = $scope.getNewColor();

                console.log($scope.gruposComisionesData);
            } else {
                $('#mdlLoading').modal('hide');
            }
        });
    };

    setTimeout( function(){
        $scope.setActiveTab($scope.lstTabs[2]);
    }, 1000);

    $scope.conIva = ['$0.00', '$0.00'];
    $scope.curComIndex = 0;

    $scope.setCuentaContable = function() {
        $scope.gruposComisionesData[ $scope.curComIndex ].data.splice(2,2);

        console.log( $scope.selectedDepartamento );
        if( $scope.selectedValueSucursalID == 0 || $scope.selectedValueSucursalID === undefined || $scope.selectedValueSucursalID === null ){
            console.log('No se ha seleccionado la sucursal');
        }
        else if ( $scope.selectedDepartamento === null ){
            console.log('No se ha seleccionado el departamento');
        }
        else if( $scope.selectedDepartamento.length == 0 ){
            console.log('No se ha seleccionado el departamento');
        }
        else{
            var Departamento = [];
            Departamento.push( $scope.selectedValueSucursalID );
            Departamento.push( $scope.selectedDepartamento );
            $scope.gruposComisionesData[ $scope.curComIndex ].data.push( Departamento );

            $scope.lstRegistroContable = [];
            $scope.lstRegistroContable = comisionesRepository.getComisionTemplate();
            $scope.lstRegistroContable[0].cuenta = $scope.selectedDepartamento.cuentaContable;
            $scope.lstRegistroContable[0].concepto = $scope.selectedDepartamento.descripcion.substring(8);
            $scope.lstRegistroContable[1].cuenta = $scope.lstRegistroContable[1].cuenta.replace('F', $scope.selectedDepartamento.subCuenta);
            $scope.lstRegistroContable[2].cuenta = $scope.lstRegistroContable[2].cuenta.replace('F', $scope.selectedDepartamento.subCuenta);

            var currentComision = $scope.gruposComisionesData[ $scope.curComIndex ].data[0];
            var currentInteres  = $scope.gruposComisionesData[ $scope.curComIndex ].data[1];

            $scope.lstRegistroContable[0].cargo = currentComision.abono; // Ok mas o menos
            $scope.lstRegistroContable[1].cargo = currentInteres.abono;
            $scope.lstRegistroContable[2].abono = currentComision.abono + currentInteres.abono;
            $scope.objEdicion.montoAcumuladoUsuario = currentComision.abono;

            $scope.conIva[0] = $scope.lstRegistroContable[2].abono;
            $scope.conIva[1] = $scope.lstRegistroContable[2].abono;

            console.log( 'RegistroContable', $scope.lstRegistroContable );
            $scope.gruposComisionesData[ $scope.curComIndex ].data.push( $scope.lstRegistroContable );
            console.log( $scope.gruposComisionesData );
        }


    };

    $scope.nextRegistro = function(){
        if( $scope.curComIndex < ($scope.gruposComisionesData.length - 1) )
            $scope.curComIndex++;
    }

    $scope.prevRegistro = function(){
        if( $scope.curComIndex > 0 )
            $scope.curComIndex--;
    }

    $scope.validarMontos = function() {
        console.log( 'Sucursal', $scope.selectedDepartamento );
        // if( $scope.selectedValueSucursalID == 0 || $scope.selectedValueSucursalID === undefined || $scope.selectedValueSucursalID === null ){
        //     console.log('No se ha seleccionado la sucursal');
        // }
        // else if( $scope.selectedDepartamento.length == 0 ){
        //     console.log('No se ha seleccionado el departamento');
        // }
        // else{
        //     var Departamento = [];
        //     Departamento.push( $scope.selectedValueSucursalID );
        //     Departamento.push( $scope.selectedDepartamento );
        //     $scope.gruposComisionesData[ $scope.curComIndex ].data.push( Departamento );

        //     console.log( $scope.gruposComisionesData );
        // }

        // if ($scope.objEdicion.usarMontoCalculado === false && ($scope.objEdicion.montoAcumuladoUsuario != $scope.gridComisionesRow.abono)) {
            // swal("Aviso", "La suma de los montos deben ser iguales.", "warning");
        // } else {
            // $scope.insInteresComisionDetalle();
            // $scope.interesComisionID = 0;
            // $scope.loadingDetalle = false;
            // $scope.setActiveTab($scope.lstTabs[3]);
        // }
    };

});