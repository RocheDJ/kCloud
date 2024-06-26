package ie.djroche.kcloud.utils

import android.app.AlertDialog
import androidx.fragment.app.FragmentActivity
import ie.djroche.kcloud.R

fun createLoader(activity: FragmentActivity) : AlertDialog {
    val loaderBuilder = AlertDialog.Builder(activity)
        .setCancelable(true) // 'false' if you want user to wait
        .setView(R.layout.loading)
    var loader = loaderBuilder.create()
    loader.setTitle(R.string.app_name)
    loader.setIcon(R.mipmap.ic_launcher_round)

    return loader
}
fun showLoader(loader: AlertDialog, message: String) {
    if (!loader.isShowing) {
        loader.setTitle(message)
        loader.show()
    }
}
fun hideLoader(loader: AlertDialog) {
    if (loader.isShowing)
        loader.dismiss()
}