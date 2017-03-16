import { existsSync, mkdirSync, readFile, writeFile } from "fs";
import { join, resolve } from "path";
import rimraf from "rimraf";
import { getAppDataPath } from "../actions/remote";

const APP_FOLDER = "Wemo Menubar Controller";
const STATE_FILE_NAME = "application-state.json";

export default {
    saveState( contents ) {
        return new Promise( ( resolve, reject ) => {
            getAppDataPath().then( appDataPath => {
                const targetFolder = `${ appDataPath }/${ APP_FOLDER }`;
                if ( !existsSync( targetFolder ) ) {
                    mkdirSync( targetFolder );
                }

                const filepath = `${ targetFolder }/${ STATE_FILE_NAME }`;
                rimraf( filepath, () => {
                    writeFile(
                        filepath,
                        contents,
                        { encoding: "utf-8" },
                        err => {
                            if ( err ) {
                                reject( err );
                            }

                            resolve( true );
                        }
                    );
                } );
            } );
        } );
    },

    getState() {
        return new Promise( ( resolve, reject ) => {
            getAppDataPath().then( appDataPath => {
                const dataFile = `${ appDataPath }/${ APP_FOLDER }/${ STATE_FILE_NAME }`;
                if ( existsSync( dataFile ) ) {
                    readFile(
                        dataFile,
                        { encoding: "utf-8" },
                        ( err, data ) => {
                            if ( err ) {
                                reject( err );
                            }

                            resolve( JSON.parse( data ) );
                        }
                    );
                } else {
                    reject( new Error( `File ${ dataFile } does not exist` ) );
                }

            } );
        } );
    }
}
