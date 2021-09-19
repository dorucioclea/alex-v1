(impl-trait .trait-pool-token.pool-token-trait)

(define-fungible-token ytp-yield-wbtc-59760-wbtc)

(define-data-var token-uri (string-utf8 256) u"")
(define-data-var contract-owner principal .yield-token-pool)

;; errors
(define-constant ERR-NOT-AUTHORIZED (err u1000))

(define-public (set-contract-owner (owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (ok (var-set contract-owner owner))
  )
)

;; ---------------------------------------------------------
;; SIP-10 Functions
;; ---------------------------------------------------------

(define-read-only (get-total-supply)
  (ok (ft-get-supply ytp-yield-wbtc-59760-wbtc))
)

(define-read-only (get-name)
  (ok "ytp-yield-wbtc-59760-wbtc")
)

(define-read-only (get-symbol)
  (ok "ytp-yield-wbtc-59760-wbtc")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance ytp-yield-wbtc-59760-wbtc account))
)

(define-public (set-token-uri (value (string-utf8 256)))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (ok (var-set token-uri value))
  )
)

(define-read-only (get-token-uri)
  (ok (some (var-get token-uri)))
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq sender tx-sender) ERR-NOT-AUTHORIZED)
    (match (ft-transfer? ytp-yield-wbtc-59760-wbtc amount sender recipient)
      response (begin
        (print memo)
        (ok response)
      )
      error (err error)
    )
  )
)

(define-public (mint (recipient principal) (amount uint))
  (begin
    (asserts! (is-eq contract-caller (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (ft-mint? ytp-yield-wbtc-59760-wbtc amount recipient)
  )
)

(define-public (burn (sender principal) (amount uint))
  (begin
    (asserts! (is-eq contract-caller (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (ft-burn? ytp-yield-wbtc-59760-wbtc amount sender)
  )
)