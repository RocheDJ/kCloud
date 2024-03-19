package ie.djroche.kcloud.utils
import ie.djroche.kcloud.models.UserModel
import java.math.BigInteger
import java.security.MessageDigest

//--------------------------------------------------------------------------------------------------------------
// reference URL https://www.knowledgefactory.net/2021/01/kotlin-hashing.html
//--------------------------------------------------------------------------------------------------------------

fun encryptString(input : String ):String {
    var retValue: String =""
    try {
            val md = MessageDigest.getInstance("SHA-1") // Encryption type.
            val messageDigest = md.digest(input.toByteArray())
            val no = BigInteger(1, messageDigest)
            var hashtext = no.toString(16)
            while (hashtext.length < 32) {
                hashtext = "0$hashtext"
            }
        retValue = hashtext.toString()
        } catch (e: Exception) {
            timber.log.Timber.e("EncryptString Error %s", e.toString())
        }
    return retValue
}


