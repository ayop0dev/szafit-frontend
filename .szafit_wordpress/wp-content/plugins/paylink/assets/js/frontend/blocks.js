const {registerPaymentMethod} = window.wc.wcBlocksRegistry;
const {getSetting} = window.wc.wcSettings;
const {decodeEntities} = window.wp.htmlEntities;
const {createElement} = window.wp.element;

const settings = getSetting('paylink_data', {});
const defaultLabel = 'Paylink Payment Gateway';
const label = decodeEntities(settings.title) || defaultLabel;

const iconUrl = window.location.origin + '/wp-content/plugins/paylink/assets/icon.min.png';
const methodsImageUrl = window.location.origin + '/wp-content/plugins/paylink/assets/payment_methods_min.png';

/**
 * Label component for Paylink payment method
 */
const Label = (props) => {
    const {PaymentMethodLabel} = props.components;
    return createElement(PaymentMethodLabel, {
        icon: createElement('img', {
            src: iconUrl,
            alt: label,
            style: {
                width: '24px',
                height: '24px',
                marginRight: '8px'
            }
        })
    });
};
/**
 * Content component for Paylink payment method
 */
const Content = () => {
    return createElement('div', {
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px'
        }
    }, [
        // Description
        createElement('div', {
            key: 'description',
            style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '16px'
            }
        }, [
            settings.icon && createElement('img', {
                key: 'icon',
                src: iconUrl,
                alt: label,
                style: {
                    height: '75px',
                    margin: '15px'
                }
            }),
            createElement('div', {
                key: 'desc-text',
                dangerouslySetInnerHTML: {
                    __html: settings.description || 'Seamless transactions with popular payment methods in the Kingdom of Saudi Arabia'
                }
            })
        ]),
        // Payment methods image
        createElement('div', {
            key: 'payment-methods',
            style: {
                textAlign: 'center'
            }
        }, [
            createElement('img', {
                key: 'methods-img',
                src: methodsImageUrl,
                alt: 'Supported Payment Methods',
                style: {
                    maxHeight: '130px'
                }
            }),
            // Test mode indicator
            settings.test_mode === true && createElement('div', {
                key: 'test-mode',
                style: {
                    marginTop: '16px',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'red',
                    fontWeight: 'bold',
                    borderTop: '1px solid #ccc'
                }
            }, 'Test Mode is enabled.')
        ])
    ]);
};

/**
 * Paylink payment method config object.
 */
const PaylinkPaymentMethod = {
    name: 'paylink',
    label: createElement(Label),
    content: createElement(Content),
    edit: createElement(Content),
    canMakePayment: () => true,
    ariaLabel: label,
    supports: {
        features: settings.supports || [],
    },
};

registerPaymentMethod(PaylinkPaymentMethod);
