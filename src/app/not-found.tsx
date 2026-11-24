import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="st">
      <div className="in">
        <div className="sc">
          <div className="eyebrow">404 // SECTOR NOT FOUND</div>
          <h1 className="mid">Lost in the Void</h1>
          <p>
            The coordinate or sector you requested does not exist or has been
            decommissioned.
          </p>
          <div className="ctas">
            <Link href="/" className="fu">
              Return to Base
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
