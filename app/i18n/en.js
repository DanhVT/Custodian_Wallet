if (typeof allLang == "undefined") {
    var allLang = {};
}
allLang.en = {
    language: 'English',
    code: 'en',
    button: {
        send: "Send",
        address: "Address",
        copyAddress: "Copy Address",
        save: "Save",
        cancel: "Cancel",
        ok: "Ok",
        next: "Next",
        back: "Back",
        search: "Search",
        addContact: "Contact",
        create: "Create",
        update: "Update",
        confirm: "Confirm",
        createNewWallet: "Create New Wallet",
        restoreWallet: "Restore Wallet",
        copy: "Copy",
        paste: "Paste",
        delete: "Delete",
        display: "Display",
        yes: "Yes",
        no: "No",
        refresh: 'Refresh',
        close: "Close",
        finish: 'Finish',
        receive: 'Receive',
        startBackup: 'Start Backup',
        returnWallet: 'Return to wallet',
        approve: 'Approve',
        showPassphrase: 'Show Recovery Passphrase',
        backupNow: 'Backup now',
        later: 'Later',
        done: 'Done',
        show: 'Show',
        gotIt: 'Got it',
        sending: 'Sending',
        fee: 'Fee',
        remaining: 'Remaining',
        startExchange: 'Start Exchanging',
        checkBalance: 'Check Balance',
        sendMax: 'Send MAX',
        tryAgain: 'Try Again'
    },
    label: {
        walletName: 'Wallet Name :',
        walletNamePlaceholder: 'Enter your wallet name',
        password: 'Password',
        passwordPlaceholder: 'Enter your password…',
        newPassword: 'New Password :',
        newPasswordPlaceholder: 'Enter your password…',
        setPassword: 'Set password :',
        passwordconfirm: 'Confirm Password :',
        passwordconfirmPlaceholder: 'Confirm your password…',
        show: 'Show',
        hide: 'Hide',
        security: 'Password strength : ',
        weak: 'weak',
        medium: 'medium',
        fair: 'fair',
        strong: 'strong',
        name: 'Name: ',
        type: 'Type: ',
        address: 'Address:',
        description: 'Description: ',
        faq: 'FAQ',
        feedback: 'Feedback',
        yourWalletName: 'Your wallet name',
        sending: 'Sending',
        fee: 'Fee',
        remaining: 'Remaining',
        exchanging: 'Exchanging',
        receiving: 'Receiving',
        total: 'Total',
        language: 'Language',
        shapeShift: 'Exchange service',
        enterAmountPlaceholder: 'Enter {network} amount',
        youWantToExchange: 'You want to Exchange...',
        youWantToReceive: 'You want to Receive...',
        yourActivity: 'Your Activity',
        recentActivity: 'Recent Activity',
        yourPortfolio: 'Your Portfolio',
        sendComplete: 'Send complete',
        sendTo: 'Send to',
        totalBalance: 'Total Balance',
        seeDetailBlockChain: 'View detail on Blockchain',
        seeDetailWeb: 'See the transaction on web',
        sent: 'Sent',
        received: 'Received',
        today: 'Today',
        yesterday: 'Yesterday',
        fundsSent: 'Funds sent',
        fundsReceived: 'Funds received',
        sendingFunds: "Sending funds",
        receivingFunds: "Receiving funds",
        amount: "Amount",
        yourAddress: "Your Address",
    },
    /*Register Page*/
    register: {
        createNewWallet: {
            newPassPhrase: {
                head: 'Your wallet passphrase',
                warn: ['This recovery passphrase will allow you to restore your wallet and balance in case the application is either uninstalled/terminated or lost.',
                    'Kindly write down or save this 12-word passphrase in a secure location. Please keep this passphrase confidential and refrain from disclosing to other people.'
                ],
                title: 'Passphrase'
            },
            newPassPhraseConfirm: {
                head: 'Important',
                warn: ['Recovery passphrase is extremely important to protect your funds. If your passphrase is leaked to a third-party, there are risks of your funds being manipulated or misused.',
                    'If this wallet application is uninstalled or terminated, with the passphrase, you can recover this wallet. We advise that you save your passphrase in a secure place and keep it confidential (not saved on your computer or internet).'
                ],
                alert: 'Have you stored your recovery phrase ?',
            },
            enterNewPassPhrase: {
                head: 'Enter passphrase',
                warn: ['To ensure that you have properly saved your passphrase, please enter it below.'],
                title: 'Input here'
            },
            setWalletName: {
                errors: {
                    walletNameExisted: 'Wallet name already existed',
                    walletNameInvalid: 'Wallet name must be not empty and only has Alphabet chacracter',
                },
            },
            setPassword: {
                warn: ['This password is used to confirm your remittance (sending funds).'],
                errors: {
                    passwordInvalid: 'Password too weak'
                }
            },
        },
        restoreWallet: {
            invalidPhassphrase: {
                head: 'Passphrase Invalid',
                blackText: [
                    'Passphrase was not accepted.',
                    'Ensure the following:'
                ],
                orangeText: [
                    '- All lowercase text',
                    '- Check your spelling',
                    '- No extra spaces between words'
                ]
            }
        }
    },
    /*Select Languages*/
    selectLanguages: {
        head: "Select language.",
        change: "Select Language",
        en: "English",
        jp: "日本語",
        vi: "Tiếng Việt",
        cn: "中文"
    },
    term: {
        head: 'Terms and Conditions of Use',
        read: 'I have READ and AGREE with the terms and conditions.'
    },
    mainMenu: {
        head: "Menu",
        balance: "Balance",
        contact: "Contacts",
        overview: "Overview",
        wallet: "Wallet",
        backup: "Backup",
        exchange: "Exchange",
        transactionHistory: "History",
        options: "Options",
        optionsChangePassword: "Change Password",
        optionsDisplayPhrase: "Display Passphrase ",
        optionsNewWallet: "New/Restore Wallet",
        optionsChangeWalletName: 'Change wallet name',
        optionsChangeLanguage: 'Language & Currency ',
        optionsSetting: "Setting",
        help: "Help",
        selectWallet: "Current wallet...",
        connecting: "Connecting....",
        footer: "Copy right by Cardano-labo",
        newsfeed: "News feed",
        newsfeedMenu: "News feed",
    },
    backup: {
        head: 'Backup your digital assets',
        contentRows: [
            "For security, let's backup all your digital assets",
            "Easy to complete"
        ],
        success: {
            head: 'Your digital assets are now safe',
            contentRows: [
                'Thank you for backing up your wallet. If you would like to see your recovery passphrase, please click below.'
            ],
        },
        dialog: {
            head: 'Please backup your wallet',
            contentRows: [
                'Transfer to your wallet has been confirmed. <br>Please back up the wallet to monitor your assets properly!',
                'Complete the backup in 3 easy steps'
            ],
            step: [
                'Save recovery passphrase',
                'Confirm passphrase',
                'Set password'
            ]
        },
        step: {
            showPassphrase: {
                head: 'Save recovery passphrase',
                rows: [
                    'Recovery passphrase will restore your wallet and balance in case application is uninstalled/terminated or lost.',
                    'Write down or save recovery passphrase in a secure location. Refrain from disclosing to others.'
                ],
                title: 'Passphrase',
                tooltip: 'Copy function has been disabled for security purposes'
            },
            showPassphraseConfirm: {
                head: 'Important',
                rows: [
                    'If wallet is uninstalled or terminated, wallet with most recent balance can be restored with the recovery passphrase.',
                    'Write down and save your recovery passphrase in a secure location and keep it confidential (not saved on your computer or internet).'
                ]
            },
            enterPassphrase: {
                head: 'Confirm recovery passphrase',
                rows: [
                    'To make sure that you have properly saved your passphrase, please choose passphrases as correct order.'
                ],
                title: 'Input here',
                errors: 'Invalid recovery passphrase'
            },
            setPassword: {
                head: 'Set password',
                rows: [
                    'Set a password to confirm your remittance (sending funds) and for other security purposes.'
                ],
                title: 'Input here'
            },
            SetPassWordNote: {
                head: 'Important',
                rows: [
                    'Once you forget your password, even the wallet operator cannot help recover your password.',
                    'In case you forget your password, please move to the Wallet Recovery section at the top of this page to create a new wallet.'
                ]
            },
            backupStop: {
                head: 'Important',
                rows: [
                    'Your wallet backup has not been completed. Once you leave this page, next time you will need to start backup from the beginning. Do you want to stop here?'
                ]
            }
        }
    },
    exchange: {
        dashboard: {
            head: [
                '1. Choose your exchanging coins',
                '2. Enter exchanging amount'
            ],
            errors: {
                maxDeposit: [
                    '{name} amount is larger than limit deposit',
                    'Max. deposit amount : {amount}'
                ],
                minDeposit: [
                    '{name} amount is smaller than minimum deposit',
                    'Min. deposit amout : {amount}'
                ],
                overBalance: [
                    'Amount is over than available balance'
                ],
                errorChoose: {
                    head: 'Exchange service is not available at the moment.',
                    msg: 'Please choose another pair or try again after several minutes.'
                }
            },
            fee: "Fee is"
        },
        processing: {
            title: 'Processing your exchange request',
            steps: [
                'Sending',
                'Exchanging',
                'Completed'
            ],
            sending: {
                head: 'Sending assets to exchange service.',
                rows: [
                    'Your exchange will take about a minute. Quanta Wallet is sending your assets to an exchange service.'
                ]
            },
            exchanging: {
                head: 'Exchanging at exchange service.',
                rows: [
                    'Your exchange will take about a minute. Quanta Wallet is sending your assets to an exchange service.'
                ]
            },
            complete: {
                head: 'Exchanging complete!!',
                rows: [
                    'Exchange procedure accepted and processing.',
                    'Once exchange is complete and confirmed, result will be reflected on the balance.',
                    'Please give it a few moments.'
                ]
            }
        },
        dialog: {
            enterPassword: {
                header: 'Enter your password',
                incorrectPassword: "Invalid password",
            }
        }
    },
    setting: {
        dialog: {
            changePassword: {
                header: "Change password",
                lblCurrentPassword: 'Current password',
                hldCurrentPassword: 'Input current password',
                lblNewPassword: 'New password',
                hldNewPassword: 'Input new password',
                btnUpdate: 'Update',
                btnCancel: 'Cancel',
                lblPasswordMetter: 'Security',
                btnShowPassword: {
                    show: 'Show',
                    hide: 'Hide'
                },
                errors: {
                    wrongPassword: 'Current password is incorrect',
                    unknow: 'Cannot change password, please check your OS permission'
                },
                messages: {
                    changePasswordOk: 'Password changed.'
                }
            },
            displayPhassPhrase: {
                header: "Enter your password",
                instructions: [
                    "To view your recovery passphrase, please provide your password."
                ],
                passphraseInstructions: [
                    "* This passphrase will allow you to restore your wallet in case of wallet loss.",
                    "* Please save these 12 words at a secure place."
                ],
                passphraseIntro: [
                    'Write down or save recovery passphrase in a secure location. Refrain from disclosing to others.'
                ],
                password: "Password:",
                passwordPlaceholder: "Enter your password...",
                passwordIncorrect: "Password is incorrect",
                passphrase: "Your passphrase",
                btnShowPassword: {
                    show: 'Show',
                    hide: 'Hide'
                },
            },
            newWallet: {
                header: "Create New Wallet / Restore Wallet",
                contentRows: [
                    "Are you sure you want to create a new wallet, or restore your wallet?",
                    "* if you forgot or lost your password, you can set a new password by restoring your wallet with your 12 word passphrase."
                ]
            },
            changeWalletName: {
                header: "Rename wallet",
                contentRows: [
                    "Please input your new wallet name below."
                ],
                lblWalletName: 'Wallet name',
                walletNamePlaceholder: 'Enter wallet name...',
                messages: {
                    errors: {
                        nameNotUpdated: 'Cannot update wallet name. Please try again.'
                    },
                    success: {
                        nameUpdated: 'Wallet name updated.'
                    }
                }
            },
            activeFiat: {
                header: 'Currency',
                title: 'Currency',
            },
            feeSend: {
                header: 'Select Fee',
                note: 'It takes a fee when sending cryptocurrency funds such as bitcoin. This fee is fixed, not depended upon by the country and timezone of recipient. The higher the fee is, the quicker the confirmation of transaction is completed. ',
                setting: {
                    high: 'Priority',
                    medium: 'Normal',
                    low: 'Economy'
                }
            }
        }
    },
    contact: {
        create: {
            head: 'Create New Contact',
            searchPlaceholder: 'Search a contact....',
            typePlaceholder: 'Enter your name...',
            addressPlaceholder: 'Enter the address...',
            descriptionPlaceholder: 'Enter some description (optional)',
            toast: {
                newContact: 'New contact added.',
                deleteContact: 'Contact deleted.',
                updateContact: 'Contact updated.',
                addFavorite: 'A contact was add to your favorite.',
                removeFavorite: 'A contact remove to your favorite.',
            },
            errors: {
                invalidAddress: 'invalid Address'
            }
        },
        edit: {
            head: 'Edit Contact'
        },
        delete: {
            head: 'Are you sure?',
            warn: 'Do you want to delete this contact information?',
        },
        label: {
            favorites: 'Favorites',
            contacts: 'All Contacts',
            noFavorites: 'no favorites',
            noContacts: 'no contacts',
        }

    },
    transaction: {
        pageHead: "Transaction History",
        noTransaction: "There isn't any transaction",
        fee: "fee",
        txid: "ID",
        newTxNotification: "Processing new transaction.",
        newTxConfirmed: "Transaction complete.",
        detail: "View detail on Blockchain",
        dialog: {
            viewTx: {
                head: "Transaction information",
                status: "Status",
                done: "Done",
                pending: "Processing",
                datetime: "Date/Time",
                txid: "Transaction ID",
                value: "Value",
                fee: "Fee",
                description: "Description"
            }
        }
    },
    balance: {
        balanceChangedNotification: "Balance changed.",
        view: {
            balance: 'Balance',
            spotRate: 'Spot rate',
            btnSend: 'Send',
            btnReceive: 'Receive',
            btnHistory: 'History'
        },
        dialog: {
            receive: {
                btnClose: 'Close',
                btnCopy: 'Copy',
                imgAddress: 'Click to copy image to clipboard',
                lblAddress: 'Address',
                title: 'Your {{coinName}} address',
                toastCopyAddress: 'Address copied to clipboard.',
                toastCopyImage: 'QR code address copied to clipboard.',
                lblSpecific: 'Requested amount',
                lblNone: 'Unspecified',
                lblRequest: 'Request amount',
                lblEnterAmount: 'Enter {value} amount'
            },
            sendCoin: {
                head: "Send",
                sendTo: "Send To",
                amount: "Amount",
                sendToPlaceholder: "Select address...",
                amountPlaceholder: "Enter {var} amount...",
                errors: {
                    requireSendToAddress: "Please select receiver.",
                    invalidSendToAddress: "Invalid receiver address.",
                    invalidAmount: "Send amount is over your balance.",
                    otherAddress: "You can not send to yourself."
                },
                tooltip: [
                    'Fee is a mining fee of blockchain network. ',
                    'You can change Fee',
                    '[Options] > [Select Fee]'
                ],
            },
            sendCoinEnterPassword: {
                head: "Send",
                password: "Password",
                passwordPlaceholder: "Enter your password...",
                passwordInstructions: [
                    "Please enter your password."
                ],
                btnShowPassword: {
                    show: 'Show',
                    hide: 'Hide'
                },
                errors: {
                    requirePassword: "Password is required.",
                    incorrectPassword: "Invalid password",
                    balanceNotEnough: "Available balance is insufficient.",
                    cannotSend: "Can't send {{coinName}}."
                },
                messages: {
                    sendSuccess: "{{coinName}} send transaction received."
                }
            }
        }
    },
    checkVersionDialog: {
        head: "New version is available",
        contentRow1: "A new version of Alta Wallet is now available.",
        contentRow2Part1: "Please visit",
        contentRow2Part2: "Alta Apps",
        contentRow2Part3: "website to download.",
        newFeatures: 'New Features (Version {version})',
        goWeb: 'Do you go to website?',
    },
    onboarding: {
        balance: {
            overview: {
                title: 'Overview',
                body: [
                    'You can view your cryptocurrency total balance here.'
                ]
            },
            balance: {
                title: 'Balance ( 1 / 4 )',
                body: [
                    'You can view your cryptocurrency total balance here.',
                    'You can also change the displayed currency from the above tab.'
                ]
            },
            wallet: {
                title: 'Wallet ( 2 / 4 )',
                body: [
                    'You can manage your crypto currencies here.',
                ]
            },
            receive: {
                title: 'Receive',
                body: [
                    'You can verify your unique cryptocurrency address here.',
                    'You can increase your wallet balance by sending appropriate funds to this address.'
                ]
            },
            send: {
                title: 'Send',
                body: [
                    'Press this button to send cryptocurrency to someone.',
                    'Save a beneficiary address in your Contacts to easily send cryptocurrency.'
                ]
            },
        },
        history: {
            congratulations: {
                title: 'Congratulations',
                body: [
                    'We are processing your very first transfer.',
                    'Please note that your transaction may take 10 mins to a few hours to complete.',
                    'You can verify the status of your transaction from your <a ui-sref="dashboard.transaction"> < History ></a>'
                ]
            },
            aboutTransaction: {
                title: 'About Transaction',
                body: [
                    'On this page, you can verify your deposits (receive) and remittance (send).',
                    'Transaction IDs are an unique IDs used to identify a particular transaction from the transaction history.',
                    'Fees are commission charges that cost to remit (send) funds.'
                ]
            },
        }
    },
    help: {
        head: 'Alta Wallet FAQ'
    },
    addNewCoin: {
        head: 'New coin "DASH"',
        messages: [
            'Thank you for downloading Alta Wallet version 1.1. DASH coin is now being supported.',
            'Please enter password to integrate DASH coin into your wallet.',
            '(For security reasons, password entry is required.)',
            'What\'s DASH? : <a href="https://www.dash.org/">https://www.dash.org/</a>'
        ],
        toast: 'DASH coin successfully added to wallet.'
    },
    networkError: {
        head: 'Connection Error',
        messages: [
            'Network corrupted. Check your network connections and try again.',
        ]
    },
    newsfeed: {
        noNewsFeed: 'No newsfeed available'
    },

    qnt: {
        menu: "QNT",
        tabTitle: "QNT",
        address: "Quanta Token Address",
        balance: "Token Balance",
    },

    autoUpdate: {
        title: "Alert",
        message: "New update available. Update now or update at next application startup.",
        yes: "Update now",
        no: "Next startup"
    }

};