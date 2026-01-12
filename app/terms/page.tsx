import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

/**
 * This file contains the Terms of Use and Disclaimer for the AI Chatbot.
 * It outlines the terms and conditions under which the chatbot is provided,
 * including limitations of liability, user responsibilities,
 * and data security.
 *
 * Please do NOT modify this file!
 *
 * @file app/terms/page.tsx
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * Terms component that displays the terms of use and disclaimer for the AI Chatbot.
 * Please do NOT modify this file.
 */
export default function Terms() {
  return (
    <div className="w-full flex justify-center p-10">
      <div className="w-full max-w-screen-md space-y-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground hover:text-gray-700 underline"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Chatbot
        </Link>
        <h1 className="text-3xl font-bold">AI Chatbot</h1>
        <h2 className="text-2xl font-semibold">
          Terms of Use and Disclaimer for AI Chatbot
        </h2>
        <ol className="list-decimal list-inside space-y-4">
          <li className="text-foreground">
            <span className="font-semibold">Acceptance of Terms:</span> By
            accessing and using the AI chatbot ("Chatbot") provided by Son
            Nguyen ("Provider"), you acknowledge that you have read, understood,
            and agreed to be bound by these Terms of Use. If you do not agree
            with these terms, do not use the Chatbot.
          </li>
          <li className="text-foreground">
            <span className="font-semibold">No Warranties:</span> The Chatbot is
            provided "as is" and "as available" without any warranties, express
            or implied. Son Nguyen makes no representations or warranties
            regarding the accuracy, reliability, completeness, or suitability of
            the Chatbot for any purpose. To the fullest extent permitted by law,
            all warranties, including but not limited to implied warranties of
            merchantability, fitness for a particular purpose, and
            non-infringement, are expressly disclaimed.
          </li>
          <li className="text-foreground">
            <span className="font-semibold">
              No Guarantees on Availability or Support:
            </span>{" "}
            Son Nguyen does not guarantee that the Chatbot will be available at
            all times, be uninterrupted, secure, or error-free. No technical
            support, maintenance, or updates are guaranteed or required to be
            provided.
          </li>
          <li className="text-foreground">
            <span className="font-semibold">Limitation of Liability:</span> To
            the fullest extent permitted by applicable law, Son Nguyen shall not
            be liable for any direct, indirect, incidental, consequential,
            special, exemplary, or punitive damages arising from or related to
            your use of or inability to use the Chatbot. This includes but is
            not limited to loss of profits, data, business, or any other losses,
            even if Son Nguyen has been advised of the possibility of such
            damages.
          </li>
          <li className="text-foreground">
            <span className="font-semibold">
              No Legal, Financial, or Professional Advice:
            </span>{" "}
            The Chatbot is intended for informational and general purposes only.
            It does not constitute legal, financial, medical, or professional
            advice. Any reliance on the information provided by the Chatbot is
            at your own risk.
          </li>
          <li className="text-foreground">
            <span className="font-semibold">User Responsibility:</span> You are
            solely responsible for your use of the Chatbot and any actions or
            decisions made based on its output. Son Nguyen is not responsible
            for any consequences resulting from the use or misuse of the
            Chatbot.
          </li>
          <li className="text-foreground">
            <span className="font-semibold">Data Security and Privacy:</span>{" "}
            You acknowledge that any data transmitted to or through the Chatbot
            is not secured and may be processed by third parties. Do not upload,
            share, or transmit any sensitive, confidential, or personal
            information. All conversations conducted through the Chatbot are
            considered equivalent to public postings, and Son Nguyen does not
            guarantee the confidentiality or security of any data shared.
          </li>
          <li className="text-foreground">
            <span className="font-semibold">Indemnification:</span> You agree to
            indemnify, defend, and hold harmless Son Nguyen from any claims,
            liabilities, damages, losses, and expenses, including reasonable
            legal fees, arising from your use of the Chatbot or violation of
            these Terms of Use.
          </li>
          <li className="text-foreground">
            <span className="font-semibold">Modifications to Terms:</span> Son
            Nguyen reserves the right to modify these Terms of Use at any time
            without prior notice. Continued use of the Chatbot constitutes
            acceptance of the modified terms.
          </li>
          <li className="text-foreground">
            <span className="font-semibold">Governing Law:</span> These Terms of
            Use shall be governed by and construed in accordance with the laws
            of the applicable jurisdiction without regard to its conflict of law
            provisions.
          </li>
          <li className="text-foreground">
            <span className="font-semibold">Inspiration:</span> This chatbot
            application was greatly inspired by Dr. Daniel Ringel's work and
            chatbot. However, the chatbot is not affiliated with or endorsed by
            Dr. Daniel Ringel. The chatbot is a separate entity and operates
            independently of Dr. Daniel Ringel's work.
          </li>
          <li className="text-foreground">
            <span className="font-semibold">Contact Information:</span> If you
            have any questions or concerns regarding these Terms of Use, please
            contact Son Nguyen at{" "}
            <a href="https://sonnguyenhoang.com" className="underline">
              sonnguyenhoang.com
            </a>
            .
          </li>
        </ol>
      </div>
    </div>
  );
}
