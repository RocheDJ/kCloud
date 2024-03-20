package ie.djroche.kcloud.activities

import android.content.Intent
import android.content.pm.PackageManager
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.tech.NfcV
import android.os.Bundle
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import ie.djroche.kcloud.databinding.ActivityNfcBinding
import timber.log.Timber

import java.io.IOException

class NFCActivity : AppCompatActivity(), NfcAdapter.ReaderCallback {
    private val requestCodeNFCPermission = 1001
    private lateinit var mNfcAdapter: NfcAdapter
    private var scannedValue = ""
    private lateinit var nfcText : EditText
    private lateinit var binding: ActivityNfcBinding
    val data = Intent()

    //-------------------------------------------------------------
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityNfcBinding.inflate(layoutInflater)

        //set toolbar contents
        binding.toolbar.title = title
        setSupportActionBar(binding.toolbar)
        nfcText = binding.etInstallationID
        val view = binding.root
        setContentView(view)

        // ask for permission to use Camera
        if (ContextCompat.checkSelfPermission(
                this@NFCActivity, android.Manifest.permission.NFC
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            askNFCPermission()
        } else {
            mNfcAdapter = NfcAdapter.getDefaultAdapter(this)
            setupControls()
        }

        if (!mNfcAdapter.isEnabled) {
            Toast.makeText(this, "NFC Adaptor Not active.", Toast.LENGTH_LONG).show()
        }
    }

    //--------------------------------------------------------------------------------------------------
    private fun askNFCPermission() {
        ActivityCompat.requestPermissions(
            this@NFCActivity,
            arrayOf(android.Manifest.permission.NFC),
            requestCodeNFCPermission
        )
    }

    //---------------------------------------------------------------------------------------------
    private fun setupControls() {
        if (mNfcAdapter != null) {
            val options = Bundle()
            options.putInt(NfcAdapter.EXTRA_READER_PRESENCE_CHECK_DELAY, 250)
            mNfcAdapter.enableReaderMode(
                this,
                this,
                NfcAdapter.FLAG_READER_NFC_A or
                        NfcAdapter.FLAG_READER_NFC_B or
                        NfcAdapter.FLAG_READER_NFC_F or
                        NfcAdapter.FLAG_READER_NFC_V,
                options
            )
        }
    }
    //----------------------------------------------------------------------
    override fun onTagDiscovered(tag: Tag?) {
        //read NFV V tags ISO-15693
        var mNfcV = NfcV.get(tag)
        if (mNfcV != null) {
            mNfcV.connect() // connect to the tag
            val tagUid: ByteArray = mNfcV.tag.id // store tag UID for use in addressed commands

            var response: ByteArray
            val offset = 0 // offset of first block to read 0  each block is 4 bytes
            val blocks = 8 // number of blocks to read
            val cmdReadMultiple =
                byteArrayOf(
                    0x60.toByte(),// flags: addressed (= UID field present)
                    0x23.toByte(),// command: READ MULTIPLE BLOCKS
                    0x00.toByte(),
                    0x00.toByte(),
                    0x00.toByte(),
                    0x00.toByte(),
                    0x00.toByte(),
                    0x00.toByte(),
                    0x00.toByte(),
                    0x00.toByte(),  // placeholder for tag UID
                    (offset and 0x0ff).toByte(), // first block number
                    ((blocks - 1) and 0x0ff).toByte()
                )// number of blocks (-1 as 0x00 means one block)
            try {
                // copy in the tag ID for the read command
                System.arraycopy(tagUid, 0, cmdReadMultiple, 2, 8);
                // uses transceiver to send byte command to tag
                response = mNfcV.transceive(cmdReadMultiple)
                // Installation id stored as string number max 12 chars

               // var baString: ByteArray = ByteArray(12)
                var baString: ByteArray = ByteArray(0)
                var sPtr = 0
                var iMaxSize =12
                for (i in 0 until response.size - 1) {
                    val bByte = response[i]
                    // if we see negative number then we have finshed loop
                    if ((i > iMaxSize) && (bByte <0))
                    {
                        sPtr =iMaxSize
                    }
                    // read the chars but only the numbers  See Ascii table
                    if ((bByte > 47) && (bByte < 58) &&(sPtr < iMaxSize)) {
                        baString += bByte
                        sPtr += 1
                    }

                }
                val sData = String(baString)  //1111125017
                scannedValue = sData

                data.putExtra("scannedID", scannedValue)
                setResult(RESULT_OK,data);
                finish()
            } catch (e: Exception) {
                Timber.e("Error $e")
            } finally {
                try {
                    mNfcV.close();
                } catch (e: IOException) {
                    Timber.e("Error closing tag data$e")
                }
            }


        } else {
            Timber.i("Tag Invalid")
        }

    }
    //----------------------------------------------------------------------

    override fun onResume() {
        super.onResume()
        setupControls()
    }
    //----------------------------------------------------------------------
    override fun onPause() {
        super.onPause()
        mNfcAdapter.disableReaderMode(this);
    }

}