package ie.djroche.kcloud.auth

import android.content.Intent
import android.os.Bundle
import android.text.TextUtils
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.Observer
import ie.djroche.kcloud.R
import ie.djroche.kcloud.databinding.LoginBinding
import ie.djroche.kcloud.ui.home.Home
import timber.log.Timber

class Login : AppCompatActivity() {
    private lateinit var loginRegisterViewModel : LoginRegisterViewModel
    private lateinit var loginBinding: LoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        loginBinding = LoginBinding.inflate(layoutInflater)
        setContentView(loginBinding.root)

        loginBinding.emailSignInButton.setOnClickListener {
            signIn(loginBinding.fieldEmail.text.toString(),
                loginBinding.fieldPassword.text.toString())
        }

        loginBinding.emailCreateAccountButton.setOnClickListener {
            createAccount(loginBinding.fieldEmail.text.toString(),
                loginBinding.fieldPassword.text.toString())
        }
    }

    public override fun onStart() {
        super.onStart()
        loginRegisterViewModel = ViewModelProvider(this).get(LoginRegisterViewModel::class.java)

        loginRegisterViewModel.liveUser.observe(this, Observer
        { liveUser -> if (liveUser != null)
            startActivity(Intent(this, Home::class.java)) })


        loginRegisterViewModel.userManager.errorStatus.observe(this, Observer
        {
                status -> checkStatus(status)
        })
    }

    //Required to exit app from Login Screen - must investigate this further
    override fun onBackPressed() {
        super.onBackPressed()
        Toast.makeText(this,"Click again to Close App...", Toast.LENGTH_LONG).show()
        finish()
    }
    //------------------------------------------------------------------------------------------------
    private fun createAccount(email: String, password: String) {
        Timber.d("createAccount:$email")
        if (!validateForm()) { return }
        loginRegisterViewModel.register(email,password)
    }

    //------------------------------------------------------------------------------------------------
    private fun signIn(email: String, password: String) {
        Timber.d("signIn:$email")
        if (!validateForm()) { return }
        loginRegisterViewModel.login(email,password)
    }

    //------------------------------------------------------------------------------------------------
    private fun checkStatus(error:Boolean) {
        if (error)
            Toast.makeText(this,
                getString(R.string.auth_failed),
                Toast.LENGTH_LONG).show()
    }
    //------------------------------------------------------------------------------------------------
    private fun validateForm(): Boolean {
        var valid = true

        val email = loginBinding.fieldEmail.text.toString()
        if (TextUtils.isEmpty(email)) {
            loginBinding.fieldEmail.error = "Required."
            valid = false
        } else {
            loginBinding.fieldEmail.error = null
        }

        val password = loginBinding.fieldPassword.text.toString()
        if (TextUtils.isEmpty(password)) {
            loginBinding.fieldPassword.error = "Required."
            valid = false
        } else {
            loginBinding.fieldPassword.error = null
        }
        return valid
    }
}