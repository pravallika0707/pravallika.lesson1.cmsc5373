import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js';
import * as Elements from '../viewpage/elements.js'
import * as Util from '../viewpage/util.js'
import * as Constants from '../model/constants.js'
import { routing } from './route.js'
import * as WelcomeMessage from '../viewpage/welcome_message.js'

const auth = getAuth();

export let currentUser = null;

export function addEventListeners() {

    Elements.formSignIn.addEventListener('submit', async e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            Elements.modalSignin.hide();

        }
        catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            Util.info('Sign in Error', JSON.stringify(error), Elements.modalSignin);
            if (Constants.DEV)
                console.log(`sign in is error: ${errorCode} | ${errorMessage}`);
        }
    });

    Elements.menuSignout.addEventListener('click', async () => {
        try {
            await signOut(auth)
        }
        catch (e) {
            Util.info('Sig out error', JSON.stringify(e));
            if (Constants.DEV)
                console.log(`signout error` + e)
        }
    });

    onAuthStateChanged(auth, authStateChangeObserver);
}

function authStateChangeObserver(user) {
    if (user) {
        currentUser = user;
        let elements = document.getElementsByClassName('modal-preauth');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
        elements = document.getElementsByClassName('modal-postauth');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'block';
        }
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        routing(pathname,hash);
    }
    else {
        currentUser = null;
        let elements = document.getElementsByClassName('modal-preauth');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'block';
        }
        elements = document.getElementsByClassName('modal-postauth');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }

        Elements.root.innerHTML = WelcomeMessage.html;
    }
}


