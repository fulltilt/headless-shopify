import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import PurchaseReceiptEmail from "@/app/email/PurchaseReceipt";
import { getProduct } from "@/app/api/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    const product = await getProduct(productId);
    console.log("webhook", productId, product);
    if (product == null || email == null) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const userFields = {
      email,
      orders: { create: { productId, pricePaidInCents } },
    };
    // const {
    //   orders: [order],
    // } = await db.user.upsert({
    //   where: { email },
    //   create: userFields,
    //   update: userFields,
    //   select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    // });

    // await resend.emails.send({
    //   from: `Support <${process.env.SENDER_EMAIL}>`,
    //   to: email,
    //   subject: "Order Confirmation",
    //   react: <PurchaseReceiptEmail order={order} product={product} />,
    // });
  }

  return new NextResponse();
}