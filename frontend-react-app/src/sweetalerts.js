// import swal from "sweetalert";
import swal from '@sweetalert/with-react'

const SOLANA_FM_URL = "https://solana.fm/tx/"
const alerts = {
    processingTxAlert: (msg = `Processing Transaction <br/> Please Wait`) => {
        var htmlObject = document.createElement('div');
        htmlObject.innerHTML = `<div className="swal-content-custom">${msg}</div>`;
        htmlObject.className = "swal-content-custom"
        swal({
            // title: msg,
            content: htmlObject,
            closeOnEsc: false,
            closeOnClickOutside: false,
            button: false,
            onOpen: () => {
                swal.showLoading();
            },
        });
    },
    confirmedTxAlert: ({ txSignature,succesMsg }) => {
        const structure = {
            title: "Success!",
            text: succesMsg,
            icon: "success",
            buttons: {
                tezos: {
                    text: "view on SolanaFM",
                    value: "solana",
                    closeModal: false,
                }
            },
        };
        (function confirm() {
            swal(structure).then((value) => {
                switch (value) {
                    case "solana":
                        window.open(SOLANA_FM_URL + txSignature+ '?cluster=devnet');
                        swal.stopLoading();
                        confirm();
                        break;                 
                    default:
                        break;
                }
            });
        })();
    },
    errorOccurredAlert: (errorMsg = "please try again") => {
        swal({
            title: "Error Occurred!",
            text: errorMsg,
            icon: "error",
        });
    },
    simplyAlert: (msg) => {
        swal({
            text: msg,
            icon: "warning",
        });
    },
};

export default alerts;
